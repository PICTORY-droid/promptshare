'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [time, setTime] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [glitchText, setGlitchText] = useState('+ new')

  const originalText = '+ new'
  const glitchChars = '!@#$%^&*<>?/\\|[]{}~`'

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('ko-KR', { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isHovered) {
      setGlitchText(originalText)
      return
    }

    let iteration = 0
    const interval = setInterval(() => {
      setGlitchText(
        originalText.split('').map((char, index) => {
          if (char === ' ') return ' '
          if (index < iteration) return originalText[index]
          return glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }).join('')
      )
      if (iteration >= originalText.length) {
        iteration = 0
      }
      iteration += 0.5
    }, 50)

    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <nav className="sticky top-0 z-50 border-b" style={{
      background: '#0d1117', borderColor: '#30363d'
    }}>
      {/* 터미널 상단 바 */}
      <div className="px-3 py-1 flex items-center gap-2 border-b" style={{
        borderColor: '#21262d', background: '#161b22'
      }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></div>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }}></div>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></div>
        </div>
        <span className="text-xs ml-1 truncate" style={{ color: '#8b949e', fontFamily: 'monospace' }}>
          <span className="hidden sm:inline">promptshare — zsh — 80×24</span>
          <span className="sm:hidden">promptshare</span>
        </span>
        <span className="ml-auto text-xs flex-shrink-0" style={{ color: '#8b949e', fontFamily: 'monospace' }}>
          {mounted ? time : ''}
        </span>
      </div>

      {/* 메인 네비 */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center gap-2">
        <Link href="/" className="flex items-center gap-1 sm:gap-2 group min-w-0">
          <span style={{ color: '#3fb950', fontFamily: 'monospace', fontSize: '0.95rem' }}>~/</span>
          <span className="text-lg sm:text-2xl font-bold tracking-tight" style={{
            color: '#e6edf3', fontFamily: 'monospace'
          }}>prompt</span>
          <span className="text-lg sm:text-2xl font-bold" style={{ color: '#58a6ff', fontFamily: 'monospace' }}>share</span>
          <span className="blink ml-0.5 text-lg sm:text-2xl font-bold" style={{ color: '#58a6ff' }}>_</span>
        </Link>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden sm:inline text-xs px-2 py-1 rounded" style={{
            background: '#21262d', color: '#3fb950',
            fontFamily: 'monospace', border: '1px solid #30363d'
          }}>v2.0.1</span>

          <Link
            href="/create"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg font-mono font-semibold transition-all active:scale-95 text-sm"
            style={{
              background: isHovered
                ? 'linear-gradient(270deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000)'
                : 'linear-gradient(135deg, #238636, #2ea043)',
              backgroundSize: isHovered ? '400% 400%' : '100%',
              color: '#ffffff',
              border: isHovered ? '1px solid #bc8cff' : '1px solid #3fb950',
              boxShadow: isHovered ? '0 0 15px #bc8cff66' : '0 0 10px #3fb95033',
              animation: isHovered ? 'rainbow 1s linear infinite' : 'none',
              minWidth: '70px',
              fontFamily: 'monospace',
            }}
          >
            <span className="sm:hidden">{glitchText}</span>
            <span className="hidden sm:inline">+ new prompt</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
