'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const ROLES = [
  { value: '마케팅 전문가로서 브랜드 전략, 광고 카피, SNS 콘텐츠 등을 도와주는 AI', label: '📢 마케팅 전문가' },
  { value: '프론트엔드/백엔드 개발, 코드 리뷰, 디버깅을 도와주는 AI 개발자', label: '💻 개발자 도우미' },
  { value: '학생들의 학습을 돕고 개념을 쉽게 설명해주는 AI 선생님', label: '📚 학습 도우미' },
  { value: '취업 준비생의 자소서, 면접, 이력서를 도와주는 AI 취업 컨설턴트', label: '💼 취업 컨설턴트' },
  { value: '글쓰기, 블로그, 카피라이팅, 창작 활동을 도와주는 AI 작가', label: '✍️ 글쓰기 도우미' },
  { value: '건강한 식단, 운동 루틴, 라이프스타일을 도와주는 AI 헬스 코치', label: '💪 헬스 코치' },
  { value: '심리적 지지와 공감, 스트레스 관리를 도와주는 AI 상담사', label: '🧠 마음 상담사' },
  { value: '여행 일정, 맛집, 숙소, 현지 팁을 안내해주는 AI 여행 가이드', label: '✈️ 여행 가이드' },
  { value: '요리 레시피, 식재료, 요리법을 알려주는 AI 요리사', label: '🍳 요리 도우미' },
  { value: '비즈니스 전략, 창업, 투자에 대해 조언해주는 AI 비즈니스 멘토', label: '🚀 비즈니스 멘토' },
]

const TONES = [
  { value: 'friendly', label: '😊 친근하게' },
  { value: 'professional', label: '🎯 전문적으로' },
  { value: 'concise', label: '⚡ 간결하게' },
  { value: 'funny', label: '😄 유쾌하게' },
]

export default function PersonaPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [slug, setSlug] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    name: '',
    role: '',
    tone: 'friendly',
    expertise: '',
    forbidden: '',
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user) }
      else { window.location.href = '/' }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user) }
      else { window.location.href = '/' }
    })
    return () => subscription.unsubscribe()
  }, [])

  const preview = form.name && form.role ? `당신은 ${form.name}입니다.

[역할]
${form.role}

[말투]
${form.tone === 'friendly' ? '친근하고 따뜻하게' : form.tone === 'professional' ? '전문적이고 격식있게' : form.tone === 'concise' ? '간결하고 핵심만' : '유쾌하고 재미있게'} 대화하세요.
${form.expertise ? `\n[전문 분야]\n${form.expertise}` : ''}
${form.forbidden ? `\n[금지 주제]\n${form.forbidden}` : ''}

[첫 인사]
"안녕하세요! 저는 ${form.name}입니다. 무엇이든 도와드릴게요! 😊"` : ''

  const handleSubmit = async () => {
    if (!form.name || !form.role || !user) return
    setLoading(true)
    try {
      const res = await fetch('/api/persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId: user.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSlug(data.slug)
      setSystemPrompt(data.system_prompt || '')
      setDone(true)
    } catch (e) {
      alert('오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/persona/${slug}` : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: '#0d1117', border: '1px solid #30363d',
    borderRadius: '8px', color: '#e6edf3',
    fontFamily: 'monospace', fontSize: '13px', outline: 'none',
    boxSizing: 'border-box' as const,
  }

  if (done) {
    return (
      <main className="min-h-screen" style={{ background: '#0d1117', color: '#e6edf3' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 700, color: '#e6edf3', marginBottom: '8px' }}>
            <span style={{ color: '#3fb950' }}>✓</span> 페르소나 카드 생성 완료!
          </h1>
          <p style={{ fontFamily: 'monospace', fontSize: '13px', color: '#8b949e', marginBottom: '32px' }}>
            아래 링크를 공유하면 누구나 이 AI 페르소나를 사용할 수 있습니다
          </p>

          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#484f58', marginBottom: '8px' }}>// 공유 링크</p>
            <div style={{ background: '#0d1117', border: '1px solid #238636', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '13px', color: '#3fb950', margin: 0, wordBreak: 'break-all' }}>{shareUrl}</p>
            </div>
            <button onClick={handleCopy}
              style={{ width: '100%', padding: '12px', background: copied ? '#238636' : 'transparent', color: copied ? '#fff' : '#3fb950', border: '1px solid #238636', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              {copied ? '✓ 복사됨!' : '🔗 링크 복사'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button onClick={() => window.open(shareUrl, '_blank')}
              style={{ flex: 1, padding: '10px', background: '#1f6feb', color: '#fff', border: 'none', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer' }}>
              👁 미리보기
            </button>
            <button onClick={() => { setDone(false); setForm({ name: '', role: '', tone: 'friendly', expertise: '', forbidden: '' }) }}
              style={{ flex: 1, padding: '10px', background: 'transparent', color: '#8b949e', border: '1px solid #30363d', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer' }}>
              + 새로 만들기
            </button>
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#484f58', margin: '0 0 8px' }}>// 클릭 시 자동 복사 → AI에서 Ctrl+V 붙여넣기</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
            <button onClick={async () => { await navigator.clipboard.writeText(systemPrompt); window.open('https://chat.openai.com', '_blank') }}
              style={{ padding: '11px', background: '#1a2d1a', border: '1px solid #238636', borderRadius: '8px', color: '#3fb950', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>
              ↗ ChatGPT
            </button>
            <button onClick={async () => { await navigator.clipboard.writeText(systemPrompt); window.open('https://claude.ai', '_blank') }}
              style={{ padding: '11px', background: '#1f2d3d', border: '1px solid #1f6feb', borderRadius: '8px', color: '#58a6ff', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>
              ↗ Claude
            </button>
          </div>
          <div style={{ display: 'none' }}>
          </div>

          <button onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', color: '#58a6ff', fontFamily: 'monospace', fontSize: '13px', cursor: 'pointer' }}>
            ← 홈으로 돌아가기
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#e6edf3' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 16px' }}>
        <button onClick={() => router.push('/')}
          style={{ background: 'none', border: 'none', color: '#58a6ff', fontFamily: 'monospace', fontSize: '13px', cursor: 'pointer', marginBottom: '24px', padding: 0 }}>
          ← cd ..
        </button>

        <h1 style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '22px', marginBottom: '6px' }}>
          <span style={{ color: '#8b949e' }}>// </span>
          <span style={{ color: '#bc8cff' }}>🤖 AI 페르소나 카드</span>
          <span className="blink" style={{ color: '#bc8cff' }}>_</span>
        </h1>
        <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#484f58', marginBottom: '32px' }}>
          // 나만의 AI 챗봇 설정을 만들고 링크로 공유하세요
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          {/* 왼쪽: 입력 폼 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: '#21262d', padding: '8px 14px', borderBottom: '1px solid #30363d', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></div>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8b949e', marginLeft: '6px' }}>persona.config</span>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div>
                  <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '11px', color: '#8b949e', marginBottom: '6px' }}>
                    <span style={{ color: '#58a6ff' }}>const</span> name =
                  </label>
                  <input type="text" placeholder="예: 마케팅 도우미" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#bc8cff'}
                    onBlur={e => e.target.style.borderColor = '#30363d'} />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '11px', color: '#8b949e', marginBottom: '6px' }}>
                    <span style={{ color: '#58a6ff' }}>const</span> role =
                  </label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#bc8cff'}
                    onBlur={e => e.target.style.borderColor = '#30363d'}>
                    <option value="">역할 선택...</option>
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '11px', color: '#8b949e', marginBottom: '6px' }}>
                    <span style={{ color: '#58a6ff' }}>const</span> tone =
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {TONES.map(t => (
                      <button key={t.value} onClick={() => setForm(f => ({ ...f, tone: t.value }))}
                        style={{ padding: '6px 12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', cursor: 'pointer', border: '1px solid', background: form.tone === t.value ? '#2d1f3d' : 'transparent', color: form.tone === t.value ? '#bc8cff' : '#8b949e', borderColor: form.tone === t.value ? '#8957e5' : '#30363d' }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '11px', color: '#8b949e', marginBottom: '6px' }}>
                    <span style={{ color: '#58a6ff' }}>const</span> expertise = <span style={{ color: '#484f58' }}> // 선택사항</span>
                  </label>
                  <input type="text" placeholder="예: 인스타그램 마케팅, 퍼포먼스 광고" value={form.expertise}
                    onChange={e => setForm(f => ({ ...f, expertise: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#bc8cff'}
                    onBlur={e => e.target.style.borderColor = '#30363d'} />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '11px', color: '#8b949e', marginBottom: '6px' }}>
                    <span style={{ color: '#58a6ff' }}>const</span> forbidden = <span style={{ color: '#484f58' }}> // 선택사항</span>
                  </label>
                  <input type="text" placeholder="예: 정치, 종교, 불법 정보" value={form.forbidden}
                    onChange={e => setForm(f => ({ ...f, forbidden: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#bc8cff'}
                    onBlur={e => e.target.style.borderColor = '#30363d'} />
                </div>

                <button onClick={handleSubmit} disabled={loading || !form.name || !form.role}
                  style={{ width: '100%', padding: '13px', background: loading || !form.name || !form.role ? '#21262d' : 'transparent', color: loading || !form.name || !form.role ? '#6e7681' : '#bc8cff', border: '2px solid', borderColor: loading || !form.name || !form.role ? '#30363d' : '#8957e5', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, cursor: loading || !form.name || !form.role ? 'not-allowed' : 'pointer' }}>
                  {loading ? '⏳ 생성 중...' : '⑂ 페르소나 카드 생성'}
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽: 프롬프트 미리보기 */}
          <div>
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', overflow: 'hidden', position: 'sticky', top: '20px' }}>
              <div style={{ background: '#21262d', padding: '8px 14px', borderBottom: '1px solid #30363d', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }}></div>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#8b949e', marginLeft: '6px' }}>system-prompt.md — 미리보기</span>
              </div>
              <div style={{ padding: '20px', minHeight: '300px' }}>
                {preview ? (
                  <pre style={{ fontFamily: 'monospace', fontSize: '12px', color: '#e6edf3', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, margin: 0 }}>
                    {preview}
                  </pre>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '280px', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '32px' }}>🤖</div>
                    <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#484f58', textAlign: 'center' }}>
                      // 이름과 역할을 입력하면<br />프롬프트가 자동으로 생성됩니다
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 사용 방법 안내 */}
            <div style={{ marginTop: '16px', background: '#161b22', border: '1px solid #21262d', borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3fb950', marginBottom: '10px' }}>// 공유받은 사람 사용 방법</p>
              {[
                { step: '1', text: '공유 링크 접속' },
                { step: '2', text: '프롬프트 복사 버튼 클릭' },
                { step: '3', text: 'ChatGPT / Claude 접속' },
                { step: '4', text: '새 대화 시작 후 붙여넣기' },
                { step: '5', text: 'AI와 대화 시작!' },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#2d1f3d', border: '1px solid #8957e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#bc8cff' }}>{item.step}</span>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#8b949e' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
