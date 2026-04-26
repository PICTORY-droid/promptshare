'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

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
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('ko-KR', { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => { clearInterval(interval); subscription.unsubscribe() }
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
      options: { redirectTo: window.location.origin + '/auth/callback' },
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
            <span style={{ color: '#3fb950', fontFamily: 'monospace', fontSize: '0.95rem' }}>~/</span>
            <span className="text-lg sm:text-2xl font-bold tracking-tight" style={{ color: '#e6edf3', fontFamily: 'monospace' }}>Prompt</span>
            <span className="text-lg sm:text-2xl font-bold" style={{ color: '#58a6ff', fontFamily: 'monospace' }}>Lab</span>
            <span className="blink ml-0.5 text-lg sm:text-2xl font-bold" style={{ color: '#58a6ff' }}>_</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:inline text-xs px-2 py-1 rounded" style={{ background: '#21262d', color: '#3fb950', fontFamily: 'monospace', border: '1px solid #30363d' }}>v2.0.1</span>

            {mounted && (
              user ? (
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setShowMenu(!showMenu)}
                    style={{ background: 'none', border: '1px solid #30363d', borderRadius: '50%', padding: 0, cursor: 'pointer', width: '32px', height: '32px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {avatarUrl
                      ? <img src={avatarUrl} alt="프로필" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      : <span style={{ color: '#58a6ff', fontSize: '14px', fontFamily: 'monospace' }}>{displayName[0].toUpperCase()}</span>
                    }
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
