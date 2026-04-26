'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'


function getGrade(totalCopied: number) {
  if (totalCopied >= 500) return 'diamond'
  if (totalCopied >= 200) return 'gold'
  if (totalCopied >= 100) return 'silver'
  if (totalCopied >= 50) return 'bronze'
  return 'normal'
}

function GradeAvatar({ avatarUrl, displayName, grade }: { avatarUrl?: string; displayName: string; grade: string }) {
  const inner = (
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#161b22', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
      {avatarUrl
        ? <img src={avatarUrl} alt="프로필" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
        : <span style={{ color: '#58a6ff', fontSize: '14px', fontFamily: 'monospace' }}>{displayName[0].toUpperCase()}</span>
      }
    </div>
  )

  if (grade === 'normal') {
    return (
      <div style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px dashed #555' }}></div>
        {inner}
      </div>
    )
  }

  if (grade === 'bronze') {
    return (
      <div style={{ position: 'relative', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`
          @keyframes pl-bronze-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pl-bronze-glow { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
          .pl-bronze-ring { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(#f0883e 0deg,#f0883e 20deg,transparent 20deg,transparent 40deg,#f0883e 40deg,#f0883e 60deg,transparent 60deg,transparent 80deg,#f0883e 80deg,#f0883e 100deg,transparent 100deg,transparent 120deg,#f0883e 120deg,#f0883e 140deg,transparent 140deg,transparent 160deg,#f0883e 160deg,#f0883e 180deg,transparent 180deg,transparent 200deg,#f0883e 200deg,#f0883e 220deg,transparent 220deg,transparent 240deg,#f0883e 240deg,#f0883e 260deg,transparent 260deg,transparent 280deg,#f0883e 280deg,#f0883e 300deg,transparent 300deg,transparent 320deg,#f0883e 320deg,#f0883e 340deg,transparent 340deg,transparent 360deg); animation: pl-bronze-spin 6s linear infinite, pl-bronze-glow 1.5s ease-in-out infinite; }
          .pl-bronze-mask { position: absolute; inset: 4px; border-radius: 50%; background: #0d1117; z-index: 1; }
        `}</style>
        <div className="pl-bronze-ring"></div>
        <div className="pl-bronze-mask"></div>
        <div style={{ position: 'relative', zIndex: 2 }}>{inner}</div>
      </div>
    )
  }

  if (grade === 'silver') {
    return (
      <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`
          @keyframes pl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pl-spin-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          .pl-silver-outer { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(#e8e8e8,#888,#fff,#aaa,#ddd,#666,#fff,#999,#e8e8e8); animation: pl-spin 3s linear infinite; }
          .pl-silver-inner { position: absolute; inset: 3px; border-radius: 50%; background: conic-gradient(#666,#fff,#888,#ddd,#555,#eee,#666); animation: pl-spin-rev 2s linear infinite; }
          .pl-silver-mask { position: absolute; inset: 7px; border-radius: 50%; background: #0d1117; z-index: 1; }
        `}</style>
        <div className="pl-silver-outer"></div>
        <div className="pl-silver-inner"></div>
        <div className="pl-silver-mask"></div>
        <div style={{ position: 'relative', zIndex: 2 }}>{inner}</div>
      </div>
    )
  }

  if (grade === 'gold') {
    return (
      <div style={{ position: 'relative', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`
          @keyframes pl-gold-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pl-gold-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
          @keyframes pl-gold-aura { 0%,100% { box-shadow: 0 0 15px 4px rgba(212,175,55,0.6); } 50% { box-shadow: 0 0 35px 10px rgba(255,215,0,0.9); } }
          .pl-gold-outer { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(#b8860b,#ffd700,#daa520,#ffe066,#b8860b,#ffd700,#daa520,#ffe066,#b8860b); animation: pl-gold-spin 3s linear infinite, pl-gold-aura 1.5s ease-in-out infinite; }
          .pl-gold-inner { position: absolute; inset: 4px; border-radius: 50%; background: conic-gradient(#ffd700,#b8860b,#ffe066,#daa520,#ffd700); animation: pl-gold-rev 1.5s linear infinite; }
          .pl-gold-dots { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle at 50% 3%,#ffd700 2px,transparent 3px),radial-gradient(circle at 85% 15%,#ffd700 2px,transparent 3px),radial-gradient(circle at 97% 50%,#ffd700 2px,transparent 3px),radial-gradient(circle at 85% 85%,#ffd700 2px,transparent 3px),radial-gradient(circle at 50% 97%,#ffd700 2px,transparent 3px),radial-gradient(circle at 15% 85%,#ffd700 2px,transparent 3px),radial-gradient(circle at 3% 50%,#ffd700 2px,transparent 3px),radial-gradient(circle at 15% 15%,#ffd700 2px,transparent 3px); animation: pl-gold-spin 4s linear infinite; z-index: 2; }
          .pl-gold-mask { position: absolute; inset: 8px; border-radius: 50%; background: #0d1117; z-index: 1; }
        `}</style>
        <div className="pl-gold-outer"></div>
        <div className="pl-gold-inner"></div>
        <div className="pl-gold-mask"></div>
        <div className="pl-gold-dots"></div>
        <div style={{ position: 'relative', zIndex: 3 }}>{inner}</div>
      </div>
    )
  }

  // diamond
  return (
    <div style={{ position: 'relative', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes pl-dia-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pl-dia-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes pl-dia-pulse { 0%,100% { opacity: 0.8; } 50% { opacity: 1; } }
        .pl-dia-glow { position: absolute; inset: -4px; border-radius: 50%; box-shadow: 0 0 20px 8px rgba(188,140,255,0.7),0 0 40px 16px rgba(88,166,255,0.4); animation: pl-dia-pulse 1s ease-in-out infinite; }
        .pl-dia-r1 { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(#ff0080,#ff8c00,#ffd700,#00ff88,#00bfff,#8000ff,#ff0080); animation: pl-dia-spin 1.5s linear infinite; }
        .pl-dia-r2 { position: absolute; inset: 3px; border-radius: 50%; background: conic-gradient(#00bfff,#8000ff,#ff0080,#ff8c00,#ffd700,#00ff88,#00bfff); animation: pl-dia-rev 1s linear infinite; }
        .pl-dia-r3 { position: absolute; inset: 6px; border-radius: 50%; background: conic-gradient(#ffd700,#00ff88,#00bfff,#8000ff,#ff0080,#ff8c00,#ffd700); animation: pl-dia-spin 2s linear infinite; }
        .pl-dia-mask { position: absolute; inset: 10px; border-radius: 50%; background: #0d1117; z-index: 1; }
      `}</style>
      <div className="pl-dia-glow"></div>
      <div className="pl-dia-r1"></div>
      <div className="pl-dia-r2"></div>
      <div className="pl-dia-r3"></div>
      <div className="pl-dia-mask"></div>
      <div style={{ position: 'relative', zIndex: 2 }}>{inner}</div>
    </div>
  )
}

function MatrixRain() {
  useEffect(() => {
    const canvas = document.getElementById('matrix-canvas-global') as HTMLCanvasElement
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
      ctx.font = fontSize + 'px monospace'
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, y * fontSize)
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }
    const interval = setInterval(draw, 33)
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', handleResize)
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize) }
  }, [])
  return <canvas id="matrix-canvas-global" style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.15 }} />
}

function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    interface Particle { x: number; y: number; size: number; alpha: number; vx: number; vy: number; color: string }
    const particles: Particle[] = []
    const colors = ['#3fb950', '#58a6ff', '#bc8cff', '#39c5cf']
    let animId: number
    const onMove = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        particles.push({ x: e.clientX, y: e.clientY, size: Math.random() * 4 + 1, alpha: 1, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, color: colors[Math.floor(Math.random() * colors.length)] })
      }
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy; p.alpha -= 0.03; p.size *= 0.97
        if (p.alpha <= 0) { particles.splice(i, 1); continue }
        ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color
        ctx.shadowBlur = 8; ctx.shadowColor = p.color
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore()
      }
      animId = requestAnimationFrame(animate)
    }
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    const onTouch = (e: TouchEvent) => { for (let i = 0; i < 3; i++) { particles.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, size: Math.random() * 4 + 1, alpha: 1, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, color: colors[Math.floor(Math.random() * colors.length)] }) } }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch)
    window.addEventListener('resize', handleResize)
    animate()
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animId)
    }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }} />
}

export default function Navbar() {
  const [time, setTime] = useState('')
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [totalCopied, setTotalCopied] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('ko-KR', { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    let realtimeSub: ReturnType<typeof supabase.channel> | null = null

    const loadActivity = async (userId: string) => {
      const { data } = await supabase.from('user_activity').select('total_copied').eq('user_id', userId).single()
      if (data) {
        setTotalCopied(data.total_copied || 0)
      } else {
        await supabase.from('user_activity').insert({ user_id: userId, total_copied: 0, daily_copied: 0 })
      }
    }

    const setupRealtime = (userId: string) => {
      if (realtimeSub) supabase.removeChannel(realtimeSub)
      realtimeSub = supabase
        .channel('user_activity_' + userId)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_activity',
          filter: 'user_id=eq.' + userId,
        }, (payload) => {
          setTotalCopied((payload.new as { total_copied: number }).total_copied || 0)
        })
        .subscribe()
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadActivity(session.user.id)
        setupRealtime(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadActivity(session.user.id)
        setupRealtime(session.user.id)
      } else {
        if (realtimeSub) supabase.removeChannel(realtimeSub)
      }
    })

    return () => { clearInterval(interval); subscription.unsubscribe(); if (realtimeSub) supabase.removeChannel(realtimeSub) }
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogin = async (provider: 'google' | 'kakao') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + '/auth/callback', scopes: provider === 'kakao' ? 'profile_nickname profile_image' : undefined },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowMenu(false)
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '사용자'

  return (
    <>
      <MatrixRain />
      <CursorTrail />
      <nav className="sticky top-0 z-50 border-b" style={{ background: '#0d1117', borderColor: '#30363d' }}>
        <div className="px-3 py-1 flex items-center gap-2 border-b" style={{ borderColor: '#21262d', background: '#161b22' }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></div>
          </div>
          <span className="text-xs ml-1 truncate" style={{ color: '#8b949e', fontFamily: 'monospace' }}>
            <span className="hidden sm:inline">promptlab — zsh — 80×24</span>
            <span className="sm:hidden">promptlab</span>
          </span>
          <span className="ml-auto text-xs flex-shrink-0" style={{ color: '#8b949e', fontFamily: 'monospace' }}>{mounted ? time : ''}</span>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center gap-2">
          <div onClick={() => window.location.href = '/'} className="flex items-center gap-1 sm:gap-2 group min-w-0 cursor-pointer">
            <img src="/logo-icon.png" alt="PromptLab" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span className="text-lg sm:text-2xl font-bold tracking-tight" style={{ color: '#e6edf3', fontFamily: 'monospace' }}>Prompt</span>
            <span className="text-lg sm:text-2xl font-bold" style={{ color: '#58a6ff', fontFamily: 'monospace' }}>Lab</span>
            <span className="blink ml-0.5 text-lg sm:text-2xl font-bold" style={{ color: '#58a6ff' }}>_</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:inline text-xs px-2 py-1 rounded" style={{ background: '#21262d', color: '#3fb950', fontFamily: 'monospace', border: '1px solid #30363d' }}>v2.0.1</span>
            {mounted && (
              <button onClick={() => {
                if (user) { window.location.href = '/persona' }
                else { alert('회원 전용 메뉴입니다.\n로그인 후 이용해주세요.'); }
              }} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                style={{ background: '#2d1f3d', color: '#bc8cff', border: '1px solid #8957e5', fontFamily: 'monospace', cursor: 'pointer', textDecoration: 'none' }}>
                🤖 {user ? <span style={{ marginLeft: '2px' }}>AI 페르소나</span> : <span style={{ marginLeft: '2px' }}>AI</span>}
              </button>
            )}

            {mounted && (
              user ? (
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setShowMenu(!showMenu)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GradeAvatar avatarUrl={avatarUrl} displayName={displayName} grade={getGrade(totalCopied)} />
                  </button>
                  {showMenu && (
                    <div style={{ position: 'absolute', right: 0, top: '40px', background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', minWidth: '160px', zIndex: 100, overflow: 'hidden' }}>
                      <div style={{ padding: '10px 14px', borderBottom: '1px solid #21262d' }}>
                        <div style={{ color: '#e6edf3', fontSize: '12px', fontFamily: 'monospace', fontWeight: 700 }}>{displayName}</div>
                        <div style={{ color: '#8b949e', fontSize: '10px', fontFamily: 'monospace', marginTop: '2px' }}>{user.email}</div>
                      </div>
                      <a href="/my-collection" style={{ display: 'block', padding: '10px 14px', color: '#58a6ff', fontSize: '12px', fontFamily: 'monospace', textDecoration: 'none', borderBottom: '1px solid #21262d' }}
                        onMouseOver={e => (e.currentTarget.style.background = '#21262d')}
                        onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                        📁 내 컬렉션
                      </a>

                      <button onClick={handleLogout}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', color: '#f85149', fontSize: '12px', fontFamily: 'monospace', background: 'none', border: 'none', cursor: 'pointer' }}
                        onMouseOver={e => (e.currentTarget.style.background = '#21262d')}
                        onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                        ⏏ 로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <button onClick={() => handleLogin('google')}
                    style={{ background: '#21262d', border: '1px solid #30363d', borderRadius: '6px', padding: '5px 10px', color: '#e6edf3', fontSize: '11px', fontFamily: 'monospace', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    onMouseOver={e => (e.currentTarget.style.borderColor = '#58a6ff')}
                    onMouseOut={e => (e.currentTarget.style.borderColor = '#30363d')}>
                    <svg width="12" height="12" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    구글
                  </button>
                  <button onClick={() => handleLogin('kakao')}
                    style={{ background: '#FEE500', border: '1px solid #FEE500', borderRadius: '6px', padding: '5px 10px', color: '#191919', fontSize: '11px', fontFamily: 'monospace', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#191919"><path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.68 5.07 4.2 6.48l-1.08 3.96L9.6 18.9c.78.12 1.58.18 2.4.18 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/></svg>
                    카카오
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
