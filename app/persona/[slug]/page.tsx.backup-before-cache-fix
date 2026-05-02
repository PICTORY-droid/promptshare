'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import { use } from 'react'

declare global { interface Window { Kakao: { init: (key: string) => void; isInitialized: () => boolean; Share: { sendDefault: (options: Record<string, unknown>) => void } } } }

interface PersonaCard {
  id: string
  name: string
  role: string
  tone: string
  expertise: string
  system_prompt: string
  created_at: string
}

const TONE_LABEL: Record<string, string> = {
  friendly: '😊 친근하게',
  professional: '🎯 전문적으로',
  concise: '⚡ 간결하게',
  funny: '😄 유쾌하게',
}

export default function PersonaSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const slug = String(resolvedParams?.slug || '').trim()
  const router = useRouter()
  const [persona, setPersona] = useState<PersonaCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.Kakao) {
        const script = document.createElement('script')
        script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'
        script.async = true
        script.onload = () => {
          if (!window.Kakao.isInitialized()) window.Kakao.init('8d2c2590ce75f2f21d3bb4bf6b437e61')
        }
        document.head.appendChild(script)
      } else if (!window.Kakao.isInitialized()) {
        window.Kakao.init('8d2c2590ce75f2f21d3bb4bf6b437e61')
      }
    }
  }, [])

  useEffect(() => {
    let alive = true

    const timer = setTimeout(() => {
      if (alive) setLoading(false)
    }, 4000)

    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from('persona_cards')
          .select('*')
          .eq('slug', slug)
          .maybeSingle()

        if (!alive) return

        if (error || !data) {
          setPersona(null)
          return
        }

        setPersona(data)
      } catch {
        if (alive) setPersona(null)
      } finally {
        if (alive) {
          clearTimeout(timer)
          setLoading(false)
        }
      }
    }

    fetch()

    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [slug])

  const handleCopy = async () => {
    if (!persona) return
    await navigator.clipboard.writeText(persona.system_prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = persona ? `[${persona.name}] AI 페르소나 카드\n${shareUrl}\n\nPromptLab에서 만든 AI 챗봇 설정을 공유받았어요!` : ''

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
        <div style={{ fontFamily: 'monospace', color: '#58a6ff', fontSize: '16px' }}>
          <span style={{ color: '#3fb950' }}>$</span> loading persona<span className="blink">_</span>
        </div>
      </main>
    )
  }

  if (!persona) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
        <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>404</p>
          <p style={{ color: '#8b949e', marginBottom: '24px' }}>// 페르소나 카드를 찾을 수 없습니다</p>
          <button onClick={() => router.push('/')}
            style={{ color: '#58a6ff', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace' }}>
            ← 홈으로
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#e6edf3' }}>
      {shareMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShareMenuOpen(false)}>
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', width: '100%', maxWidth: '340px', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ background: '#21262d', padding: '10px 14px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#8b949e' }}>share.persona</span>
              <button onClick={() => setShareMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#484f58', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#8b949e', margin: '0 0 4px' }}>// {persona.name} 공유하기</p>
              <button onClick={async () => { await navigator.clipboard.writeText(shareUrl); setShareMenuOpen(false); alert('링크가 복사됐습니다!') }}
                style={{ padding: '12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', color: '#e6edf3', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}>
                🔗 링크 복사
              </button>
              <button onClick={() => { window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText), '_blank'); setShareMenuOpen(false) }}
                style={{ padding: '12px', background: '#000', border: '1px solid #30363d', borderRadius: '8px', color: '#fff', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}>
                𝕏 X (트위터)
              </button>
              <button onClick={() => { window.open('https://share.naver.com/web/shareView?url=' + encodeURIComponent(shareUrl) + '&title=' + encodeURIComponent(persona.name), '_blank'); setShareMenuOpen(false) }}
                style={{ padding: '12px', background: '#03C75A', border: 'none', borderRadius: '8px', color: '#fff', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}>
                N 네이버 블로그
              </button>
              <button onClick={() => { window.location.href = 'sms:?body=' + encodeURIComponent(shareText); setShareMenuOpen(false) }}
                style={{ padding: '12px', background: '#21262d', border: '1px solid #30363d', borderRadius: '8px', color: '#3fb950', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}>
                💬 문자로 공유
              </button>
              <button onClick={() => {
                  if (window.Kakao?.isInitialized()) {
                    window.Kakao.Share.sendDefault({
                      objectType: 'feed',
                      content: {
                        title: '[PromptLab] ' + persona.name + ' AI 페르소나',
                        description: persona.role.substring(0, 80),
                        imageUrl: 'https://promptlab.io.kr/og-image-v2.png',
                        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
                      },
                      buttons: [{ title: '페르소나 카드 보기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
                    })
                  } else {
                    navigator.clipboard.writeText(shareUrl)
                    alert('카카오 SDK 미로드 - 링크가 복사됐습니다.')
                  }
                  setShareMenuOpen(false)
                }}
                style={{ padding: '12px', background: '#FEE500', border: 'none', borderRadius: '8px', color: '#191919', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}>
                💬 카카오톡으로 공유
              </button>
              <button onClick={() => { window.location.href = 'mailto:?subject=' + encodeURIComponent(persona.name) + '&body=' + encodeURIComponent(shareText); setShareMenuOpen(false) }}
                style={{ padding: '12px', background: '#21262d', border: '1px solid #30363d', borderRadius: '8px', color: '#58a6ff', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}>
                📧 이메일로 공유
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
        <button onClick={() => router.push('/my-personas')}
          style={{ background: 'none', border: 'none', color: '#58a6ff', fontFamily: 'monospace', fontSize: '13px', cursor: 'pointer', marginBottom: '24px', padding: 0 }}>
          ← cd ..
        </button>

        {/* 헤더 카드 */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ background: '#21262d', padding: '8px 14px', borderBottom: '1px solid #30363d', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></div>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8b949e', marginLeft: '6px' }}>persona-card.md</span>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#2d1f3d', border: '2px solid #8957e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                🤖
              </div>
              <div>
                <h1 style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 700, color: '#e6edf3', margin: '0 0 4px' }}>{persona.name}</h1>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#2d1f3d', color: '#bc8cff', border: '1px solid #8957e5', borderRadius: '999px', padding: '2px 10px', fontFamily: 'monospace', fontSize: '11px' }}>
                    {TONE_LABEL[persona.tone] || persona.tone}
                  </span>
                  {persona.expertise && (
                    <span style={{ background: '#1f2d3d', color: '#58a6ff', border: '1px solid #1f6feb', borderRadius: '999px', padding: '2px 10px', fontFamily: 'monospace', fontSize: '11px' }}>
                      {persona.expertise}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#8b949e', lineHeight: 1.6, margin: 0 }}>
              {persona.role.length > 100 ? persona.role.substring(0, 100) + '...' : persona.role}
            </p>
          </div>
        </div>

        {/* 시스템 프롬프트 */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ background: '#21262d', padding: '8px 14px', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></div>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8b949e', marginLeft: '6px' }}>system-prompt.txt</span>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#484f58' }}>{persona.system_prompt.length}자</span>
          </div>
          <div style={{ display: 'flex', maxHeight: '260px', overflowY: 'auto' }}>
            <div style={{ padding: '16px 8px', borderRight: '1px solid #21262d', minWidth: '36px', textAlign: 'right' }}>
              {persona.system_prompt.split('\n').map((_, i) => (
                <div key={i} style={{ fontFamily: 'monospace', fontSize: '11px', color: '#484f58', lineHeight: '1.7' }}>{i + 1}</div>
              ))}
            </div>
            <pre style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#e6edf3', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, margin: 0, flex: 1 }}>
              {persona.system_prompt}
            </pre>
          </div>
        </div>

        {/* 복사 + AI 버튼 묶음 */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <button onClick={handleCopy}
            className="w-full transition-all hover:scale-[1.02] active:scale-95"
            style={{ width: '100%', padding: '14px', background: 'transparent', color: copied ? '#3fb950' : '#bc8cff', border: `2px solid ${copied ? '#238636' : '#8957e5'}`, borderRadius: '10px', fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '12px', boxShadow: copied ? '0 0 20px #3fb95044' : 'none' }}>
            {copied ? '✓ 프롬프트 복사됨!' : 'copy system prompt'}
          </button>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#484f58', textAlign: 'center', margin: '0 0 10px' }}>// 복사 후 아래 AI에 붙여넣으세요</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button onClick={() => window.open('https://chat.openai.com', '_blank')}
              style={{ padding: '11px', background: '#1a2d1a', border: '1px solid #238636', borderRadius: '8px', color: '#3fb950', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>
              ↗ ChatGPT
            </button>
            <button onClick={() => window.open('https://claude.ai', '_blank')}
              style={{ padding: '11px', background: '#1f2d3d', border: '1px solid #1f6feb', borderRadius: '8px', color: '#58a6ff', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>
              ↗ Claude
            </button>
          </div>
        </div>

        {/* 사용 가이드 */}
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#3fb950', marginBottom: '16px' }}>// 사용 방법 (5단계)</p>
          {[
            { step: '01', title: '프롬프트 복사', desc: '위의 "copy system prompt" 버튼 클릭' },
            { step: '02', title: 'AI 서비스 접속', desc: 'ChatGPT 또는 Claude 접속' },
            { step: '03', title: '새 대화 시작', desc: '새 채팅창 열기' },
            { step: '04', title: '프롬프트 붙여넣기', desc: '복사한 내용을 입력창에 붙여넣고 전송' },
            { step: '05', title: '대화 시작!', desc: `AI가 ${persona.name}처럼 응답합니다` },
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2d1f3d', border: '1px solid #8957e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#bc8cff', fontWeight: 700 }}>{item.step}</span>
              </div>
              <div>
                <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#e6edf3', fontWeight: 700, margin: '0 0 2px' }}>{item.title}</p>
                <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8b949e', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 공유 버튼 */}
        <button onClick={() => setShareMenuOpen(true)}
          style={{ width: '100%', padding: '12px', background: 'transparent', color: '#8b949e', border: '1px solid #30363d', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', cursor: 'pointer', marginBottom: '16px' }}>
          ↗ 이 페르소나 카드 공유하기
        </button>

        <div style={{ textAlign: 'center' }}>
          <a href="/" style={{ fontFamily: 'monospace', fontSize: '11px', color: '#484f58', textDecoration: 'none' }}>
            powered by <span style={{ color: '#3fb950' }}>PromptLab</span>
          </a>
        </div>
      </div>
    </main>
  )
}
