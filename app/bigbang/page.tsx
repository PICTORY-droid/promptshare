'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'

interface Prompt {
  id: string
  title: string
  description: string
  category: string
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Coding: { bg: '#1f2d3d', text: '#58a6ff', border: '#1f6feb' },
  Writing: { bg: '#2d1f3d', text: '#bc8cff', border: '#8957e5' },
  Marketing: { bg: '#2d1f1f', text: '#f0883e', border: '#bd561d' },
  Education: { bg: '#1f2d1f', text: '#3fb950', border: '#238636' },
  General: { bg: '#2d2d1f', text: '#d29922', border: '#9e6a03' },
  Other: { bg: '#1f2d2d', text: '#39c5cf', border: '#1b7c83' },
  Career: { bg: '#1f2a2d', text: '#79c0ff', border: '#1f6feb' },
  Business: { bg: '#2d2d1f', text: '#ffa657', border: '#bd561d' },
}

const TAGS = ['마케팅', '코딩', '취업', '글쓰기', 'SNS', '창업', '자동화', 'AI', '교육', '비즈니스']

export default function BigBangPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [kw1, setKw1] = useState('')
  const [kw2, setKw2] = useState('')
  const [kw3, setKw3] = useState('')
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [results, setResults] = useState<Prompt[]>([])
  const [status, setStatus] = useState('')
  const [banging, setBanging] = useState(false)
  const [orbScale, setOrbScale] = useState(1)
  const [orbGlow, setOrbGlow] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const [bangCode, setBangCode] = useState('')

  useEffect(() => {
    supabase.from('prompts').select('id, title, description, category').limit(500).then(({ data, error }) => {
      if (error) console.error('프롬프트 로드 오류:', error)
      if (data) {
        console.log('로드된 프롬프트 수:', data.length)
        setPrompts(data)
      }
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      a: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.3 + 0.1,
    }))
    let frame: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.a += Math.sin(Date.now() * 0.001 * s.speed) * 0.01
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0.05, s.a)})`
        ctx.fill()
      })
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])

  const fillKw = (word: string) => {
    if (!kw1) setKw1(word)
    else if (!kw2) setKw2(word)
    else if (!kw3) setKw3(word)
    else setKw1(word)
  }

  const triggerBigBang = async () => {
    if (banging) return
    if (prompts.length === 0) { setStatus('// 프롬프트 로딩 중... 잠시 후 다시 클릭해주세요'); return }
    setBanging(true)
    setShowCards(false)
    setResults([])
    setStatus('// 우주 수축 중...')

    setOrbScale(3)
    setOrbGlow(true)

    await new Promise(r => setTimeout(r, 500))
    setOrbScale(0)
    setStatus('// ⚡ 빅뱅 발생!')

    await new Promise(r => setTimeout(r, 700))
    setOrbScale(1)
    setOrbGlow(false)

    const keywords = [kw1, kw2, kw3].filter(Boolean)
    let filtered = keywords.length > 0
      ? prompts.filter(p => {
          const text = (p.title + p.description + p.category).toLowerCase()
          return keywords.some(k => text.includes(k.toLowerCase()))
        })
      : []

    if (filtered.length < 3) {
      filtered = [...prompts].sort(() => Math.random() - 0.5).slice(0, 12)
    } else {
      filtered = filtered.slice(0, 12)
    }

    const code = 'BANG-' + Math.random().toString(36).substr(2, 4).toUpperCase()
    setBangCode(code)
    setResults(filtered)
    setStatus(`// ${filtered.length}개 소환 완료 · ${code}`)
    setShowCards(true)
    setBanging(false)
  }

  const orbStyle: React.CSSProperties = {
    width: '48px', height: '48px', borderRadius: '50%',
    background: '#1a0d2e', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '20px', zIndex: 2,
    border: '1px solid #bc8cff44', cursor: 'pointer',
    transform: `scale(${orbScale})`,
    boxShadow: orbGlow ? '0 0 80px #bc8cff, 0 0 160px #58a6ff44' : '0 0 16px #bc8cff55',
    transition: 'transform 0.5s ease, box-shadow 0.3s ease',
  }

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#e6edf3', position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

      <style>{`
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spin-rev { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.5);opacity:0} }
        @keyframes card-fly { 0%{transform:translate(var(--fx),var(--fy)) scale(0);opacity:0} 60%{transform:translate(0,0) scale(1.05);opacity:1} 100%{transform:translate(0,0) scale(1);opacity:1} }
        .orb-float { animation: float 3s ease-in-out infinite; }
        .ring1 { animation: spin-slow 8s linear infinite; }
        .ring2 { animation: spin-rev 5s linear infinite; }
        .ring3 { animation: spin-slow 3s linear infinite; }
        .pulse1 { animation: pulse-ring 2s ease-out infinite; }
        .pulse2 { animation: pulse-ring 2s ease-out 1s infinite; }
        .card-fly { animation: card-fly 0.5s ease forwards; }
        .tag:hover { border-color: #3fb950 !important; color: #3fb950 !important; background: #1a2d1a !important; }
        .prompt-card:hover { border-color: #3fb950 !important; transform: translateY(-4px); box-shadow: 0 8px 24px #3fb95022; }
      `}</style>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px', position: 'relative', zIndex: 10 }}>

        {/* 뒤로가기 */}
        <button onClick={() => router.push('/')}
          style={{ background: 'none', border: 'none', color: '#58a6ff', fontFamily: 'monospace', fontSize: '13px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}>
          ← cd ..
        </button>

        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#484f58', letterSpacing: '4px', marginBottom: '6px' }}>// PROMPT UNIVERSE ENGINE</div>
          <h1 style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 700, color: '#e6edf3' }}>
            프롬프트 <span style={{ color: '#3fb950' }}>빅뱅</span>
          </h1>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#484f58', marginTop: '6px' }}>
            키워드로 맞춤 프롬프트를 소환하는 시스템
          </p>
        </div>

        {/* 오브 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={triggerBigBang}>
            <div className="ring1" style={{ position: 'absolute', width: '110px', height: '110px', borderRadius: '50%', border: '1px solid #3fb95033', borderTopColor: '#3fb950' }}></div>
            <div className="ring2" style={{ position: 'absolute', width: '86px', height: '86px', borderRadius: '50%', border: '1px solid #58a6ff33', borderRightColor: '#58a6ff' }}></div>
            <div className="ring3" style={{ position: 'absolute', width: '64px', height: '64px', borderRadius: '50%', border: '1px solid #3fb95033', borderBottomColor: '#3fb950' }}></div>
            <div className="pulse1" style={{ position: 'absolute', width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #3fb950' }}></div>
            <div className="pulse2" style={{ position: 'absolute', width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #3fb950' }}></div>
            <div className={banging ? '' : 'orb-float'} style={orbStyle}>✦</div>
          </div>
        </div>

        {/* 인트로 텍스트 */}
        <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '11px', color: '#484f58', marginBottom: '16px' }}>
          키워드 3개 입력 → 오브 클릭 → 맞춤 프롬프트 소환
        </div>

        {/* 키워드 입력 */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '12px' }}>
          {[
            { id: 'kw1', val: kw1, set: setKw1, label: 'KW·01' },
            { id: 'kw2', val: kw2, set: setKw2, label: 'KW·02' },
            { id: 'kw3', val: kw3, set: setKw3, label: 'KW·03' },
          ].map((kw, i) => (
            <div key={kw.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ fontSize: '8px', color: '#484f58', letterSpacing: '2px', fontFamily: 'monospace' }}>{kw.label}</div>
              <input value={kw.val} onChange={e => kw.set(e.target.value)} onKeyDown={e => e.key === 'Enter' && triggerBigBang()}
                placeholder="키워드" maxLength={7}
                style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '7px 0', color: '#e6edf3', fontFamily: 'monospace', fontSize: '12px', outline: 'none', width: '90px', textAlign: 'center' }}
                onFocus={e => e.target.style.borderColor = '#3fb950'}
                onBlur={e => e.target.style.borderColor = '#30363d'}
              />
            </div>
          ))}
        </div>

        {/* 태그 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '12px', padding: '0 4px' }}>
          {TAGS.map((tag) => (
            <button key={tag} className="tag" onClick={() => fillKw(tag)}
              style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '999px', padding: '4px 12px', fontSize: '11px', color: '#8b949e', cursor: 'pointer', fontFamily: 'monospace', transition: 'all 0.15s' }}>
              {tag}
            </button>
          ))}
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          
        </div>

        {/* 상태 */}
        <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '10px', color: '#3fb950', minHeight: '20px', marginBottom: '16px', letterSpacing: '1px' }}>
          {status}
        </div>

        {/* 결과 카드 */}
        {showCards && results.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '8px' }}>
            {results.map((p, i) => {
              const colors = CATEGORY_COLORS[p.category] || CATEGORY_COLORS['Other']
              const dirs = ['−300px,−180px','300px,−180px','−260px,140px','260px,140px','0,−280px','−320px,0','320px,0','0,280px','−200px,−100px','200px,100px','−150px,200px','150px,−200px']
              const [fx, fy] = (dirs[i] || '0,0').split(',')
              return (
                <div key={p.id} className="card-fly prompt-card"
                  onClick={() => router.push(`/prompts/${p.id}`)}
                  style={{
                    background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '11px',
                    cursor: 'pointer', transition: 'all 0.2s',
                    animationDelay: `${i * 0.07}s`,
                    ['--fx' as string]: fx, ['--fy' as string]: fy,
                  }}>
                  <div style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '999px', display: 'inline-block', marginBottom: '5px', fontWeight: 700, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, letterSpacing: '1px' }}>
                    {p.category}
                  </div>
                  <div style={{ fontSize: '11px', color: '#e6edf3', fontWeight: 700, lineHeight: 1.4, marginBottom: '3px', fontFamily: 'monospace' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#484f58', lineHeight: 1.5, fontFamily: 'monospace', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
