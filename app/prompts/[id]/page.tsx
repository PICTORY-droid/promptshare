'use client'

import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

interface Prompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  author_name: string
  likes: number
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

function GlitchButton({ onClick, text, copied }: {
  onClick: () => void, text: string, copied: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [glitchText, setGlitchText] = useState(text)
  const glitchChars = '!@#$%^&*<>?/\\|[]{}~`'

  useEffect(() => {
    setGlitchText(text)
  }, [text])

  useEffect(() => {
    if (!isHovered) {
      setGlitchText(text)
      return
    }
    let iteration = 0
    const interval = setInterval(() => {
      setGlitchText(
        text.split('').map((char, index) => {
          if (char === ' ') return ' '
          if (index < iteration) return text[index]
          return glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }).join('')
      )
      if (iteration >= text.length) iteration = 0
      iteration += 0.5
    }, 50)
    return () => clearInterval(interval)
  }, [isHovered, text])

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full py-3 sm:py-4 rounded-xl font-mono font-bold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-95"
      style={{
        background: copied
          ? 'linear-gradient(135deg, #238636, #2ea043)'
          : isHovered
            ? 'linear-gradient(270deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000)'
            : 'linear-gradient(135deg, #1f6feb, #388bfd)',
        backgroundSize: isHovered ? '400% 400%' : '100%',
        color: '#ffffff',
        border: copied ? '1px solid #3fb950' : isHovered ? '1px solid #bc8cff' : '1px solid #58a6ff',
        boxShadow: copied ? '0 0 20px #3fb95044' : isHovered ? '0 0 15px #bc8cff66' : '0 0 20px #58a6ff44',
        animation: isHovered && !copied ? 'rainbow 1s linear infinite' : 'none',
      }}
    >
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
  return (
    <canvas id="matrix-canvas" style={{
      position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none'
    }} />
  )
}

function useEasterEgg() {
  useEffect(() => {
    console.log('%c🚀 PromptShare', 'color: #58a6ff; font-size: 24px; font-weight: bold;')
    console.log('%c당신은 진짜 개발자군요! 콘솔까지 열어보다니 😄', 'color: #3fb950; font-size: 14px;')
    console.log('%c// TODO: 여기에 최고의 프롬프트를 작성하세요', 'color: #8b949e; font-size: 12px;')
    console.log('%cconst bestPrompt = await fetch("/api/your-imagination")', 'color: #bc8cff; font-size: 12px; font-family: monospace;')
  }, [])
}

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export default function PromptDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isLiking, setIsLiking] = useState(false)
  const [matrixActive, setMatrixActive] = useState(false)
  const [showEasterMsg, setShowEasterMsg] = useState(false)
  const [konamiProgress, setKonamiProgress] = useState(0)

  useEasterEgg()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKonamiProgress(prev => {
      if (e.key === KONAMI[prev]) {
        const next = prev + 1
        if (next === KONAMI.length) {
          setMatrixActive(true)
          setShowEasterMsg(true)
          setTimeout(() => {
            setMatrixActive(false)
            setShowEasterMsg(false)
          }, 5000)
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
      const { id } = await params
      const { data, error } = await supabase
        .from('prompts').select('*').eq('id', id).single()
      if (error || !data) notFound()
      setPrompt(data)
      setLoading(false)
      await supabase.from('prompts')
        .update({ views: (data.views || 0) + 1 }).eq('id', id)
    }
    fetchAndIncrement()
  }, [params])

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
      const { data, error } = await supabase
        .from('prompts')
        .update({ likes: (prompt.likes || 0) + 1 })
        .eq('id', prompt.id).select().single()
      if (error) throw error
      if (data) setPrompt(data)
    } catch {
      alert('좋아요 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLiking(false)
    }
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

  const date = new Date(prompt.created_at).toLocaleDateString('ko-KR')
  const colors = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['Other']

  return (
    <main className="min-h-screen" style={{ background: '#0d1117' }}>
      <MatrixRain active={matrixActive} />

      {showEasterMsg && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] text-center px-4 w-full max-w-sm">
          <div className="px-6 py-5 rounded-xl" style={{
            background: '#161b22',
            border: '2px solid #3fb950',
            boxShadow: '0 0 40px #3fb95066',
            fontFamily: 'monospace'
          }}>
            <p className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#3fb950' }}>
              🎮 KONAMI CODE ACTIVATED!
            </p>
            <p style={{ color: '#8b949e' }}>// 진짜 개발자를 발견했습니다</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 sm:mb-8 font-mono text-sm hover:opacity-80 transition-opacity"
          style={{ color: '#58a6ff' }}>
          ← cd ..
        </Link>

        <article className="rounded-xl overflow-hidden" style={{
          background: '#161b22', border: '1px solid #30363d'
        }}>
          <div className="flex items-center gap-0 px-4 pt-3 overflow-x-auto" style={{ borderBottom: '1px solid #30363d' }}>
            <div className="px-3 sm:px-4 py-2 rounded-t-lg text-xs sm:text-sm font-mono flex items-center gap-2 flex-shrink-0" style={{
              background: '#0d1117', color: '#e6edf3',
              border: '1px solid #30363d', borderBottom: '1px solid #0d1117', marginBottom: '-1px'
            }}>
              <span style={{ color: colors.text }}>◆</span>
              <span>{prompt.title.substring(0, 20)}{prompt.title.length > 20 ? '...' : ''}.md</span>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
              <span className="text-xs px-3 py-1 rounded-full font-mono font-semibold flex-shrink-0" style={{
                background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`
              }}>
                {prompt.category}
              </span>
              <button onClick={handleLike} disabled={isLiking}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-mono text-sm transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                style={{
                  background: isLiking ? '#21262d' : '#2d1f1f',
                  color: '#ff7b72', border: '1px solid #f8514966'
                }}>
                <span>♥</span>
                <span className="font-bold">{prompt.likes}</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 font-mono" style={{ color: '#e6edf3' }}>
              {prompt.title}
            </h1>

            <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ color: '#8b949e' }}>
              {prompt.description}
            </p>

            {/* 메타 정보 - 모바일에서 세로 배치 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg font-mono" style={{
              background: '#0d1117', border: '1px solid #21262d'
            }}>
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
                <p className="text-xs mb-0 sm:mb-1 w-16 sm:w-auto flex-shrink-0" style={{ color: '#484f58' }}>// date</p>
                <p className="text-sm" style={{ color: '#e6edf3' }}>{date}</p>
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

              <div className="rounded-lg overflow-hidden" style={{
                border: '1px solid #30363d', background: '#0d1117'
              }}>
                <div className="flex items-center justify-between px-3 sm:px-4 py-2" style={{
                  background: '#161b22', borderBottom: '1px solid #30363d'
                }}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></div>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }}></div>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></div>
                  </div>
                  <span className="text-xs font-mono" style={{ color: '#484f58' }}>prompt.txt</span>
                </div>

                <div className="flex overflow-x-auto">
                  <div className="py-4 px-2 sm:px-3 text-right select-none flex-shrink-0" style={{
                    borderRight: '1px solid #21262d', minWidth: '40px'
                  }}>
                    {prompt.content.split('\n').map((_, i) => (
                      <div key={i} className="text-xs leading-6 font-mono" style={{ color: '#484f58' }}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <pre className="py-4 px-3 sm:px-4 text-xs sm:text-sm leading-6 font-mono flex-1 min-w-0"
                    style={{ color: '#e6edf3', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {prompt.content}
                  </pre>
                </div>
              </div>
            </div>

            <GlitchButton
              onClick={handleCopy}
              text={copied ? '✓ copied to clipboard!' : '$ copy prompt'}
              copied={copied}
            />

            <p className="text-center mt-4 text-xs font-mono" style={{ color: '#484f58' }}>
              // 키보드로 ↑↑↓↓←→←→BA 를 입력해보세요 😏
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}