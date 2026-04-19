'use client'

import { supabase } from '@/app/lib/supabase'
import { notFound, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, use } from 'react'

interface Prompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  author_name: string
  likes: number
  dislikes: number
  views: number
  created_at: string
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Coding: { bg: '#1f2d3d', text: '#58a6ff', border: '#1f6feb' },
  Writing: { bg: '#2d1f3d', text: '#bc8cff', border: '#8957e5' },
  Marketing: { bg: '#2d1f1f', text: '#f0883e', border: '#bd561d' },
  Education: { bg: '#1f2d1f', text: '#3fb950', border: '#238636' },
  General: { bg: '#2d2d1f', text: '#d29922', border: '#9e6a03' },
  Other: { bg: '#1f2d2d', text: '#39c5cf', border: '#1b7c83' },
}

function formatContent(content: string): string {
  const lines = content.split('\n')
  if (lines.length === 0) return content
  const firstLine = lines[0]
  const restLines = lines.slice(1).join('\n')
  const dotIndex = firstLine.indexOf('.')
  if (dotIndex === -1) return content
  const firstSentence = firstLine.substring(0, dotIndex + 1).trim()
  const rest = firstLine.substring(dotIndex + 1).trim()
  if (rest) return firstSentence + '\n' + rest + (restLines ? '\n' + restLines : '')
  return content
}

function AuthModal({
  onConfirm, onCancel,
}: {
  onConfirm: (pw: string) => void
  onCancel: () => void
}) {
  const [pw, setPw] = useState('')
  const [shake, setShake] = useState(false)

  const handleSubmit = () => {
    if (pw.length !== 4) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    onConfirm(pw)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-sm rounded-xl overflow-hidden"
        style={{ background: '#161b22', border: '1px solid #30363d', boxShadow: '0 0 40px #58a6ff22' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#21262d' }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></div>
          </div>
          <span className="text-xs ml-2 font-mono" style={{ color: '#8b949e' }}>auth.verify</span>
        </div>
        <div className="p-5 sm:p-6">
          <p className="font-mono text-sm mb-1" style={{ color: '#8b949e' }}>
            <span style={{ color: '#58a6ff' }}>$</span> sudo verify --author
          </p>
          <h2 className="font-mono font-bold text-base sm:text-lg mb-1" style={{ color: '#e6edf3' }}>
            // 작성자이신가요?
          </h2>
          <p className="font-mono text-xs mb-4" style={{ color: '#484f58' }}>
            // 비밀번호가 맞으면 수정/삭제 버튼이 표시됩니다
          </p>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input
              type="password"
              value={pw}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                setPw(val)
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              maxLength={4}
              inputMode="numeric"
              autoFocus
              placeholder="숫자 4자리"
              className={shake ? 'animate-bounce' : ''}
              style={{
                width: '100%', padding: '12px 44px 12px 14px',
                background: '#0d1117', border: '1px solid #30363d',
                borderRadius: '8px', color: '#e6edf3',
                fontFamily: 'monospace', fontSize: '20px',
                letterSpacing: '0.4em', outline: 'none',
                textAlign: 'center', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = '#30363d'}
            />
            <div style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'monospace', fontSize: '11px', color: '#484f58'
            }}>
              {pw.length}/4
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg font-mono text-sm transition-all hover:opacity-80"
              style={{ background: 'transparent', color: '#8b949e', border: '1px solid #30363d' }}>
              // 작성자 아님
            </button>
            <button onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: 'transparent', color: '#58a6ff', border: '1px solid #58a6ff' }}>
              confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PasswordModal({
  mode, onConfirm, onCancel,
}: {
  mode: 'edit' | 'delete'
  onConfirm: (pw: string) => void
  onCancel: () => void
}) {
  const [pw, setPw] = useState('')
  const [shake, setShake] = useState(false)
  const isDelete = mode === 'delete'

  const handleSubmit = () => {
    if (pw.length !== 4) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    onConfirm(pw)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-sm rounded-xl overflow-hidden"
        style={{
          background: '#161b22',
          border: `1px solid ${isDelete ? '#f8514966' : '#30363d'}`,
          boxShadow: `0 0 40px ${isDelete ? '#ff7b7222' : '#58a6ff22'}`
        }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#21262d' }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></div>
          </div>
          <span className="text-xs ml-2 font-mono" style={{ color: '#8b949e' }}>
            {isDelete ? 'Delete prompt.md' : 'vim prompt.md'}
          </span>
        </div>
        <div className="p-5 sm:p-6">
          <p className="font-mono text-sm mb-1" style={{ color: '#8b949e' }}>
            <span style={{ color: isDelete ? '#ff7b72' : '#58a6ff' }}>$</span>{' '}
            {isDelete ? 'sudo delete --confirm' : 'git checkout --edit'}
          </p>
          <h2 className="font-mono font-bold text-base sm:text-lg mb-4" style={{ color: '#e6edf3' }}>
            {isDelete ? '// 정말 삭제하시겠습니까?' : '// 수정하려면 비밀번호를 입력하세요'}
          </h2>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input
              type="password"
              value={pw}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                setPw(val)
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              maxLength={4}
              inputMode="numeric"
              autoFocus
              placeholder="숫자 4자리"
              className={shake ? 'animate-bounce' : ''}
              style={{
                width: '100%', padding: '12px 44px 12px 14px',
                background: '#0d1117',
                border: `1px solid ${isDelete ? '#f8514966' : '#30363d'}`,
                borderRadius: '8px', color: '#e6edf3',
                fontFamily: 'monospace', fontSize: '20px',
                letterSpacing: '0.4em', outline: 'none',
                textAlign: 'center', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = isDelete ? '#ff7b72' : '#58a6ff'}
              onBlur={e => e.target.style.borderColor = isDelete ? '#f8514966' : '#30363d'}
            />
            <div style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'monospace', fontSize: '11px', color: '#484f58'
            }}>
              {pw.length}/4
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg font-mono text-sm transition-all hover:opacity-80"
              style={{ background: 'transparent', color: '#8b949e', border: '1px solid #30363d' }}>
              // cancel
            </button>
            <button onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: 'transparent',
                color: isDelete ? '#ff7b72' : '#58a6ff',
                border: `1px solid ${isDelete ? '#f85149' : '#58a6ff'}`,
                boxShadow: 'none',
              }}>
              {isDelete ? 'Delete' : 'confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditModal({
  prompt, onSave, onCancel,
}: {
  prompt: Prompt
  onSave: (updated: Partial<Prompt>) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(prompt.title)
  const [description, setDescription] = useState(prompt.description)
  const [content, setContent] = useState(prompt.content)
  const [category, setCategory] = useState(prompt.category)

  const CATEGORY_COLORS_TEXT: Record<string, string> = {
    General: '#d29922', Writing: '#bc8cff', Coding: '#58a6ff',
    Marketing: '#f0883e', Education: '#3fb950', Other: '#39c5cf',
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: '#0d1117', border: '1px solid #30363d',
    borderRadius: '8px', color: '#e6edf3',
    fontFamily: 'monospace', fontSize: '14px', outline: 'none',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-3 py-4 sm:py-8 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl rounded-xl overflow-hidden my-auto"
        style={{ background: '#161b22', border: '1px solid #30363d' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#21262d' }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></div>
          </div>
          <span className="text-xs ml-2 font-mono" style={{ color: '#8b949e' }}>vim prompt.md — INSERT MODE</span>
        </div>
        <div className="p-4 sm:p-6">
          <h2 className="font-mono font-bold text-base sm:text-lg mb-5" style={{ color: '#e6edf3' }}>
            <span style={{ color: '#8b949e' }}>// </span>
            <span style={{ color: '#58a6ff' }}>프롬프트</span> 수정
            <span className="blink" style={{ color: '#58a6ff' }}>_</span>
          </h2>
          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-mono" style={{ color: '#8b949e' }}>
              <span style={{ color: '#58a6ff' }}>const</span> title =
            </label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = '#30363d'} />
          </div>
          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-mono" style={{ color: '#8b949e' }}>
              <span style={{ color: '#58a6ff' }}>const</span> description =
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }} rows={2}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = '#30363d'} />
          </div>
          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-mono" style={{ color: '#8b949e' }}>
              <span style={{ color: '#58a6ff' }}>const</span>{' '}
              <span style={{ color: CATEGORY_COLORS_TEXT[category] }}>category</span> =
            </label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = '#30363d'}>
              <option value="General">General</option>
              <option value="Writing">Writing</option>
              <option value="Coding">Coding</option>
              <option value="Marketing">Marketing</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="block mb-1.5 text-xs font-mono" style={{ color: '#8b949e' }}>
              <span style={{ color: '#58a6ff' }}>const</span> content =
            </label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }} rows={10}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = '#30363d'} />
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg font-mono text-sm transition-all hover:opacity-80"
              style={{ background: 'transparent', color: '#8b949e', border: '1px solid #30363d' }}>
              // cancel
            </button>
            <button onClick={() => onSave({ title, description, content, category })}
              className="flex-1 py-2.5 rounded-lg font-mono text-sm font-bold transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: 'transparent', color: '#3fb950', border: '1px solid #3fb950', boxShadow: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 15px #3fb95066' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}>
              git commit -m &quot;update&quot;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GlitchButton({ onClick, text, copied }: {
  onClick: () => void, text: string, copied: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [glitchText, setGlitchText] = useState(text)
  const glitchChars = '!@#$%^&*<>?/\\|[]{}~`'

  useEffect(() => { setGlitchText(text) }, [text])

  useEffect(() => {
    if (!isHovered) { setGlitchText(text); return }
    let iteration = 0
    const interval = setInterval(() => {
      setGlitchText(text.split('').map((char, index) => {
        if (char === ' ') return ' '
        if (index < iteration) return text[index]
        return glitchChars[Math.floor(Math.random() * glitchChars.length)]
      }).join(''))
      if (iteration >= text.length) iteration = 0
      iteration += 0.5
    }, 50)
    return () => clearInterval(interval)
  }, [isHovered, text])

  return (
    <button onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full py-3 sm:py-4 rounded-xl font-mono font-bold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-95"
      style={{
        background: 'transparent',
        color: copied ? '#ffffff' : isHovered ? '#ffffff' : '#58a6ff',
        border: copied ? '2px solid #3fb950' : isHovered ? '2px solid #bc8cff' : '2px solid #58a6ff',
        boxShadow: copied ? '0 0 20px #3fb95044' : isHovered ? '0 0 15px #bc8cff66' : 'none',
      }}>
      {glitchText}
    </button>
  )
}

function MatrixRain({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const chars = 'アイウエオカキクケコ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)
    const draw = () => {
      ctx.fillStyle = 'rgba(13, 17, 23, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#3fb950'
      ctx.font = `${fontSize}px monospace`
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, y * fontSize)
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }
    const interval = setInterval(draw, 33)
    return () => clearInterval(interval)
  }, [active])
  if (!active) return null
  return <canvas id="matrix-canvas" style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }} />
}

function useEasterEgg() {
  useEffect(() => {
    console.log('%c🚀 PromptLab', 'color: #58a6ff; font-size: 24px; font-weight: bold;')
    console.log('%c당신은 진짜 개발자군요! 콘솔까지 열어보다니 😄', 'color: #3fb950; font-size: 14px;')
    console.log('%c// TODO: 여기에 최고의 프롬프트를 작성하세요', 'color: #8b949e; font-size: 12px;')
    console.log('%cconst bestPrompt = await fetch("/api/your-imagination")', 'color: #bc8cff; font-size: 12px; font-family: monospace;')
  }, [])
}

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export default function PromptDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isLiking, setIsLiking] = useState(false)
  const [isDisliking, setIsDisliking] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [matrixActive, setMatrixActive] = useState(false)
  const [showEasterMsg, setShowEasterMsg] = useState(false)
  const [konamiProgress, setKonamiProgress] = useState(0)
  const [modalMode, setModalMode] = useState<'edit' | 'delete' | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isAuthor, setIsAuthor] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEasterEgg()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKonamiProgress(prev => {
      if (e.key === KONAMI[prev]) {
        const next = prev + 1
        if (next === KONAMI.length) {
          setMatrixActive(true); setShowEasterMsg(true)
          setTimeout(() => { setMatrixActive(false); setShowEasterMsg(false) }, 5000)
          return 0
        }
        return next
      }
      return 0
    })
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    const fetchAndIncrement = async () => {
      const { data, error } = await supabase
        .from('prompts').select('*').eq('id', id).single()
      if (error || !data) { notFound(); return }
      setPrompt(data)
      setLoading(false)
      await supabase.from('prompts').update({ views: (data.views || 0) + 1 }).eq('id', id)
    }
    fetchAndIncrement()
  }, [id])

  const handleAuthConfirm = async (pw: string) => {
    if (!prompt) return
    const { data, error } = await supabase
      .from('prompts').select('password').eq('id', prompt.id).single()
    if (error || !data) return
    if (data.password !== pw) {
      alert('❌ 비밀번호가 틀렸습니다.')
      setShowAuthModal(false)
      return
    }
    setIsAuthor(true)
    setShowAuthModal(false)
  }

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLike = async () => {
    if (!prompt || isLiking) return
    setIsLiking(true)
    try {
      const newLikes = liked ? (prompt.likes || 1) - 1 : (prompt.likes || 0) + 1
      const { data, error } = await supabase
        .from('prompts').update({ likes: newLikes })
        .eq('id', prompt.id).select().single()
      if (error) throw error
      if (data) { setPrompt(data); setLiked(!liked) }
    } catch { alert('좋아요 처리 중 오류가 발생했습니다.') }
    finally { setIsLiking(false) }
  }

  const handleDislike = async () => {
    if (!prompt || isDisliking) return
    setIsDisliking(true)
    try {
      const newDislikes = disliked ? (prompt.dislikes || 1) - 1 : (prompt.dislikes || 0) + 1
      const { data, error } = await supabase
        .from('prompts').update({ dislikes: newDislikes })
        .eq('id', prompt.id).select().single()
      if (error) throw error
      if (data) { setPrompt(data); setDisliked(!disliked) }
    } catch { alert('아쉬워요 처리 중 오류가 발생했습니다.') }
    finally { setIsDisliking(false) }
  }

  const handlePasswordConfirm = async (pw: string) => {
    if (!prompt) return
    const { data, error } = await supabase
      .from('prompts').select('password').eq('id', prompt.id).single()
    if (error || !data) return
    if (data.password !== pw) {
      alert('❌ 비밀번호가 틀렸습니다.')
      setModalMode(null)
      return
    }
    if (modalMode === 'delete') {
      const { error: delErr } = await supabase.from('prompts').delete().eq('id', prompt.id)
      if (delErr) { alert('삭제 중 오류가 발생했습니다.'); return }
      alert('✓ 삭제되었습니다.')
      router.push('/')
    } else if (modalMode === 'edit') {
      setModalMode(null)
      setShowEditModal(true)
    }
  }

  const handleEditSave = async (updated: Partial<Prompt>) => {
    if (!prompt) return
    const { data, error } = await supabase
      .from('prompts')
      .update({ ...updated, updated_at: new Date().toISOString() })
      .eq('id', prompt.id).select().single()
    if (error) { alert('수정 중 오류가 발생했습니다.'); return }
    if (data) setPrompt(data)
    setShowEditModal(false)
    alert('✓ 수정되었습니다.')
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
        <div className="font-mono text-lg" style={{ color: '#58a6ff' }}>
          <span style={{ color: '#3fb950' }}>$</span> loading prompt
          <span className="blink">_</span>
        </div>
      </main>
    )
  }

  if (!prompt) return notFound()

  const colors = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['Other']
  const formattedContent = formatContent(prompt.content)

  return (
    <main className="min-h-screen" style={{ background: '#0d1117' }}>
      <MatrixRain active={matrixActive} />

      {showAuthModal && (
        <AuthModal
          onConfirm={handleAuthConfirm}
          onCancel={() => setShowAuthModal(false)}
        />
      )}

      {modalMode && (
        <PasswordModal
          mode={modalMode}
          onConfirm={handlePasswordConfirm}
          onCancel={() => setModalMode(null)}
        />
      )}

      {showEditModal && (
        <EditModal
          prompt={prompt}
          onSave={handleEditSave}
          onCancel={() => setShowEditModal(false)}
        />
      )}

      {showEasterMsg && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] text-center px-4 w-full max-w-sm">
          <div className="px-6 py-5 rounded-xl" style={{
            background: '#161b22', border: '2px solid #3fb950',
            boxShadow: '0 0 40px #3fb95066', fontFamily: 'monospace'
          }}>
            <p className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#3fb950' }}>🎮 KONAMI CODE ACTIVATED!</p>
            <p style={{ color: '#8b949e' }}>// 진짜 개발자를 발견했습니다</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12">

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 font-mono text-sm hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer p-0"
          style={{ color: '#58a6ff' }}>
          ← cd ..
        </button>

        <article className="rounded-xl overflow-hidden" style={{ background: '#161b22', border: '1px solid #30363d' }}>
          <div className="flex items-center px-4 pt-3 overflow-x-auto" style={{ borderBottom: '1px solid #30363d' }}>
            <div className="px-3 sm:px-4 py-2 rounded-t-lg text-xs sm:text-sm font-mono flex items-center gap-2 flex-shrink-0" style={{
              background: '#0d1117', color: '#e6edf3',
              border: '1px solid #30363d', borderBottom: '1px solid #0d1117', marginBottom: '-1px'
            }}>
              <span style={{ color: colors.text }}>◆</span>
              <span>{prompt.title.substring(0, 20)}{prompt.title.length > 20 ? '...' : ''}.md</span>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            <div className="flex items-center justify-between mb-5 sm:mb-6 gap-2 flex-wrap">
              <span className="text-xs px-3 py-1 rounded-full font-mono font-semibold flex-shrink-0" style={{
                background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`
              }}>
                {prompt.category}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                {isAuthor ? (
                  <>
                    <button onClick={() => setModalMode('edit')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all hover:scale-105 active:scale-95"
                      style={{ background: 'transparent', color: '#58a6ff', border: '1px solid #1f6feb' }}>
                      <span>✎</span>
                      <span className="hidden sm:inline">edit</span>
                    </button>
                    <button onClick={() => setModalMode('delete')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all hover:scale-105 active:scale-95"
                      style={{ background: 'transparent', color: '#ff7b72', border: '1px solid #f85149' }}>
                      <span>✕</span>
                      <span className="hidden sm:inline">delete</span>
                    </button>
                  </>
                ) : (
                  <button onClick={() => setShowAuthModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'transparent', color: '#484f58', border: '1px solid #30363d' }}>
                    <span>🔒</span>
                    <span className="hidden sm:inline">작성자</span>
                  </button>
                )}
                <button onClick={handleLike} disabled={isLiking}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-sm transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'transparent', color: liked ? '#ff7b72' : '#8b949e', border: liked ? '1px solid #f85149' : '1px solid #484f58' }}>
                  <span>♥</span>
                  <span className="font-bold">{prompt.likes}</span>
                </button>
                <button onClick={handleDislike} disabled={isDisliking}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-sm transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'transparent', color: disliked ? '#ff7b72' : '#8b949e', border: disliked ? '1px solid #f85149' : '1px solid #484f58' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={disliked ? "#ff7b72" : "#8b949e"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 15s1.5-2 4-2 4 2 4 2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3"/>
                    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3"/>
                  </svg>
                  <span className="font-bold">{prompt.dislikes ?? 0}</span>
                </button>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 font-mono" style={{ color: '#e6edf3' }}>
              {prompt.title}
            </h1>
            <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ color: '#8b949e' }}>
              {prompt.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg font-mono"
              style={{ background: '#0d1117', border: '1px solid #21262d' }}>
              <div className="flex sm:block items-center gap-4 sm:gap-0">
                <p className="text-xs mb-0 sm:mb-1 w-16 sm:w-auto flex-shrink-0" style={{ color: '#484f58' }}>// author</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: '#21262d', color: '#58a6ff' }}>
                    {prompt.author_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm" style={{ color: '#e6edf3' }}>{prompt.author_name}</span>
                </div>
              </div>
<div className="flex sm:block items-center gap-4 sm:gap-0">
                <p className="text-xs mb-0 sm:mb-1 w-16 sm:w-auto flex-shrink-0" style={{ color: '#484f58' }}>// views</p>
                <p className="text-sm" style={{ color: '#e6edf3' }}>◎ {prompt.views}</p>
              </div>
            </div>

            <div className="mb-5 sm:mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: '#3fb950', fontFamily: 'monospace' }}>$</span>
                <span className="font-mono text-sm" style={{ color: '#8b949e' }}>cat prompt.txt</span>
              </div>
              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #30363d', background: '#0d1117' }}>
                <div className="flex items-center justify-between px-3 sm:px-4 py-2"
                  style={{ background: '#161b22', borderBottom: '1px solid #30363d' }}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></div>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }}></div>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></div>
                  </div>
                  <span className="text-xs font-mono" style={{ color: '#484f58' }}>prompt.txt</span>
                </div>
                <div className="flex overflow-x-auto">
                  <div className="py-4 px-2 sm:px-3 text-right select-none flex-shrink-0"
                    style={{ borderRight: '1px solid #21262d', minWidth: '40px' }}>
                    {formattedContent.split('\n').map((_, i) => (
                      <div key={i} className="text-xs leading-6 font-mono" style={{ color: '#484f58' }}>{i + 1}</div>
                    ))}
                  </div>
                  <pre className="py-4 px-3 sm:px-4 text-xs sm:text-sm leading-6 font-mono flex-1 min-w-0"
                    style={{ color: '#e6edf3', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {formattedContent}
                  </pre>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              {copied && (
                <div style={{
                  position: 'absolute', top: '-28px', left: '50%',
                  transform: 'translateX(-50%)', color: '#8b949e',
                  fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'nowrap',
                }}>
                  // 복사 완료!
                </div>
              )}
              <GlitchButton
                onClick={handleCopy}
                text={copied ? '✓ copied to clipboard!' : 'copy prompt'}
                copied={copied}
              />
            </div>

            <p className="text-center mt-4 text-xs font-mono" style={{ color: '#484f58' }}>
              // 키보드로 ↑↑↓↓←→←→BA 를 입력해보세요 😏
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}
