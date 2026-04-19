'use client'

import { supabase } from '@/app/lib/supabase'
import { notFound, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, use } from 'react'

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void
      isInitialized: () => boolean
      Share: {
        sendDefault: (options: Record<string, unknown>) => void
      }
    }
  }
}

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
  shares: number
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
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
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

function ShareModal({
  prompt,
  onClose,
  onShare,
}: {
  prompt: Prompt
  onClose: () => void
  onShare: () => void
}) {
  const [urlCopied, setUrlCopied] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) window.Kakao.init('b4ddc9dd04b76991410a732cacee7671')
      return
    }
    const script = document.createElement('script')
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'
    script.async = true
    script.onload = () => {
      if (!window.Kakao.isInitialized()) window.Kakao.init('b4ddc9dd04b76991410a732cacee7671')
    }
    document.head.appendChild(script)
  }, [])

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://promptlab.io.kr'
  const url = `${baseUrl}/prompts/${prompt.id}`
  const shareText = `[PromptLab] ${prompt.title}\n${url}\n\n더 많은 프롬프트 → promptlab.io.kr`

  const handleCopyURL = async () => {
    await navigator.clipboard.writeText(shareText)
    setUrlCopied(true)
    onShare()
    setTimeout(() => setUrlCopied(false), 2500)
  }

  const openSNS = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=500,noopener,noreferrer')
    onShare()
  }

  const refUrl = (ref: string) => encodeURIComponent(`${url}?ref=${ref}`)
  const encTitle = encodeURIComponent(prompt.title)
  const encText = encodeURIComponent(shareText)

  const snsOptions = [
    {
      name: '카카오톡',
      bg: '#FEE500',
      textColor: '#3C1E1E',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#3C1E1E">
          <path d="M12 3C6.477 3 2 6.597 2 11.077c0 2.754 1.566 5.19 3.938 6.7l-.98 3.648a.3.3 0 0 0 .437.336l4.204-2.768c.784.112 1.585.17 2.401.17 5.523 0 10-3.597 10-8.086C24 6.597 17.523 3 12 3z"/>
        </svg>
      ),
      action: () => {
        if (window.Kakao?.isInitialized()) {
          window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: `[PromptLab] ${prompt.title}`,
              description: prompt.description || '더 많은 프롬프트를 PromptLab에서 확인하세요.',
              imageUrl: 'https://promptlab.io.kr/og-image.png',
              link: {
                mobileWebUrl: `${url}?ref=kakao`,
                webUrl: `${url}?ref=kakao`,
              },
            },
            buttons: [
              {
                title: '프롬프트 보기',
                link: {
                  mobileWebUrl: `${url}?ref=kakao`,
                  webUrl: `${url}?ref=kakao`,
                },
              },
            ],
          })
          onShare()
        } else {
          handleCopyURL()
        }
      },
    },
    {
      name: 'X (트위터)',
      bg: '#000000',
      textColor: '#ffffff',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      action: () => openSNS(`https://twitter.com/intent/tweet?text=${encText}&url=${refUrl('twitter')}`),
    },
    {
      name: '페이스북',
      bg: '#1877F2',
      textColor: '#ffffff',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.031 4.388 11.031 10.125 11.927V15.563H7.078v-3.49h3.047V9.498c0-3.018 1.792-4.684 4.533-4.684 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.104 24 18.104 24 12.073z"/>
        </svg>
      ),
      action: () => openSNS(`https://www.facebook.com/sharer/sharer.php?u=${refUrl('facebook')}`),
    },
    {
      name: '네이버 블로그',
      bg: '#03C75A',
      textColor: '#ffffff',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
        </svg>
      ),
      action: () => openSNS(`https://share.naver.com/web/shareView?url=${refUrl('naver')}&title=${encTitle}`),
    },
    {
      name: '링크드인',
      bg: '#0A66C2',
      textColor: '#ffffff',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      action: () => openSNS(`https://www.linkedin.com/sharing/share-offsite/?url=${refUrl('linkedin')}`),
    },
    {
      name: '스레드',
      bg: '#101010',
      textColor: '#ffffff',
      icon: (
        <svg width="20" height="20" viewBox="0 0 192 192" fill="white">
          <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.23c8.249.053 14.474 2.452 18.502 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.206 17.11 97.015 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.144 0h-.29C68.77.195 47.219 9.65 32.884 28.006 19.vehicle 44.992 12.833 68.653 12.604 96v.604c.229 27.347 7.412 51.008 20.28 68 14.335 18.355 35.887 27.81 64.172 28.006h.29c25.278-.176 43.091-6.801 57.865-21.565 19.597-19.586 19.003-44.06 12.525-59.089-4.615-10.757-13.457-19.445-26.199-25.968zM96.108 129.438c-10.425.588-21.24-5.158-21.783-14.108-.4-6.677 4.76-14.109 20.426-15.018 1.788-.103 3.543-.154 5.27-.154 6.316 0 12.217.617 17.577 1.82-2.001 24.966-11.192 26.95-21.49 27.46z"/>
        </svg>
      ),
      action: () => openSNS(`https://www.threads.net/intent/post?text=${encText}`),
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-sm rounded-xl overflow-hidden"
        style={{ background: '#161b22', border: '1px solid #30363d', boxShadow: '0 0 50px #58a6ff18' }}>
        <div className="px-4 py-2 flex items-center justify-between" style={{ background: '#21262d' }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></div>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }}></div>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></div>
            </div>
            <span className="text-xs ml-1 font-mono" style={{ color: '#8b949e' }}>share.prompt</span>
          </div>
          <button onClick={onClose} style={{ color: '#484f58', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✕</button>
        </div>

        <div className="p-5">
          <p className="font-mono text-xs mb-1" style={{ color: '#8b949e' }}>
            <span style={{ color: '#58a6ff' }}>$</span> share --prompt
          </p>
          <h2 className="font-mono font-bold text-sm mb-1" style={{ color: '#e6edf3' }}>
            // 공유하기
          </h2>
          <p className="font-mono text-xs mb-4 truncate" style={{ color: '#484f58' }}>
            {prompt.title}
          </p>

          <button
            onClick={handleCopyURL}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-4 transition-all hover:scale-[1.01] active:scale-95"
            style={{
              background: urlCopied ? '#1a2d1a' : '#0d1117',
              border: urlCopied ? '1px solid #3fb950' : '1px solid #30363d',
              color: urlCopied ? '#3fb950' : '#e6edf3',
              fontFamily: 'monospace', fontSize: '13px',
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            {urlCopied ? '✓ 복사됨!' : 'URL 복사'}
          </button>

          <div className="grid grid-cols-3 gap-2">
            {snsOptions.map((opt) => (
              <button
                key={opt.name}
                onClick={opt.action}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                style={{ background: opt.bg, border: 'none', cursor: 'pointer' }}>
                {opt.icon}
                <span style={{ color: opt.textColor, fontSize: '10px', fontFamily: 'monospace', fontWeight: 600 }}>
                  {opt.name}
                </span>
              </button>
            ))}
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

export default function PromptDetailClient({ params }: { params: Promise<{ id: string }> }) {
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
  const [showShareModal, setShowShareModal] = useState(false)

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

  const handleShare = useCallback(async () => {
    if (!prompt) return
    const newShares = (prompt.shares || 0) + 1
    const { data } = await supabase
      .from('prompts')
      .update({ shares: newShares })
      .eq('id', prompt.id)
      .select()
      .single()
    if (data) setPrompt(data)
  }, [prompt])

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

      {showShareModal && (
        <ShareModal
          prompt={prompt}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
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
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
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
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-sm transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'transparent', color: '#8b949e', border: '1px solid #484f58' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
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
