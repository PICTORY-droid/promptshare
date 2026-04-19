'use client'

import { useState, useEffect, useRef } from 'react'

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
      ctx.font = `${fontSize}px monospace`
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, y * fontSize)
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }
    const interval = setInterval(draw, 33)
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      id="matrix-canvas-global"
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.15 }}
    />
  )
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

    interface Particle {
      x: number
      y: number
      size: number
      alpha: number
      vx: number
      vy: number
      color: string
    }

    const particles: Particle[] = []
    const colors = ['#3fb950', '#58a6ff', '#bc8cff', '#39c5cf']
    let mouseX = 0
    let mouseY = 0
    let animId: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: mouseX,
          y: mouseY,
          size: Math.random() * 4 + 1,
          alpha: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.03
        p.size *= 0.97
        if (p.alpha <= 0) {
          particles.splice(i, 1)
          continue
        }
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      animId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', onMove)
    const onTouch = (e: TouchEvent) => { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; for (let i = 0; i < 3; i++) { particles.push({ x: mouseX, y: mouseY, size: Math.random() * 4 + 1, alpha: 1, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, color: colors[Math.floor(Math.random() * colors.length)] }) } }
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

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  )
}

export default function Navbar() {
  const [time, setTime] = useState('')
  const [mounted, setMounted] = useState(false)
  const [mylabCount, setMylabCount] = useState(0)

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('ko-KR', { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    const updateCount = () => {
      const saved = JSON.parse(localStorage.getItem('mylab') || '[]')
      setMylabCount(saved.length)
    }
    updateCount()
    window.addEventListener('storage', updateCount)
    window.addEventListener('mylab-update', updateCount)

    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', updateCount)
      window.removeEventListener('mylab-update', updateCount)
    }
  }, [])

  return (
    <>
      <MatrixRain />
      <CursorTrail />
      <nav className="sticky top-0 z-50 border-b" style={{
        background: '#0d1117', borderColor: '#30363d'
      }}>
        <div className="px-3 py-1 flex items-center gap-2 border-b" style={{
          borderColor: '#21262d', background: '#161b22'
        }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }}></div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></div>
          </div>
          <span className="text-xs ml-1 truncate" style={{ color: '#8b949e', fontFamily: 'monospace' }}>
            <span className="hidden sm:inline">promptlab — zsh — 80×24</span>
            <span className="sm:hidden">promptlab</span>
          </span>
          <span className="ml-auto text-xs flex-shrink-0" style={{ color: '#8b949e', fontFamily: 'monospace' }}>
            {mounted ? time : ''}
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center gap-2">
          <div onClick={() => window.location.href = '/'} className="flex items-center gap-1 sm:gap-2 group min-w-0 cursor-pointer">
            <span style={{ color: '#3fb950', fontFamily: 'monospace', fontSize: '0.95rem' }}>~/</span>
            <span className="text-lg sm:text-2xl font-bold tracking-tight" style={{
              color: '#e6edf3', fontFamily: 'monospace'
            }}>Prompt</span>
            <span className="text-lg sm:text-2xl font-bold" style={{ color: '#58a6ff', fontFamily: 'monospace' }}>Lab</span>
            <span className="blink ml-0.5 text-lg sm:text-2xl font-bold" style={{ color: '#58a6ff' }}>_</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => window.location.href = '/mylab'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono text-xs transition-all hover:scale-105 active:scale-95"
              style={{ background: 'transparent', color: '#7ec99a', border: '1px solid #7ec99a44' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#7ec99a'; e.currentTarget.style.boxShadow = '0 0 10px #7ec99a33' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#7ec99a44'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7ec99a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3H15L17 9L21 21H3L7 9L9 3Z"/>
                <path d="M9 3C9 3 10 6 12 6C14 6 15 3 15 3"/>
                <path d="M7 9H17"/>
              </svg>
              <span>My Lab</span>
              {mounted && mylabCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold"
                  style={{ background: '#7ec99a', color: '#0d1117', fontSize: '10px' }}>
                  {mylabCount}
                </span>
              )}
            </button>
            <span className="hidden sm:inline text-xs px-2 py-1 rounded" style={{
              background: '#21262d', color: '#3fb950',
              fontFamily: 'monospace', border: '1px solid #30363d'
            }}>v2.0.1</span>
          </div>
        </div>
      </nav>
    </>
  )
}