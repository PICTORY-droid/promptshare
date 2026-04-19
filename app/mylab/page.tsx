'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface LabItem {
  id: string
  title: string
  category: string
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Coding: { bg: '#1f2d3d', text: '#58a6ff', border: '#1f6feb' },
  Writing: { bg: '#2d1f3d', text: '#bc8cff', border: '#8957e5' },
  Marketing: { bg: '#2d1f1f', text: '#f0883e', border: '#bd561d' },
  Education: { bg: '#1f2d1f', text: '#3fb950', border: '#238636' },
  General: { bg: '#2d2d1f', text: '#d29922', border: '#9e6a03' },
  Other: { bg: '#1f2d2d', text: '#39c5cf', border: '#1b7c83' },
  Finance: { bg: '#1f2d1f', text: '#26a641', border: '#196c2e' },
  Legal: { bg: '#2d261f', text: '#e3b341', border: '#9e6a03' },
  Health: { bg: '#2d1f1f', text: '#ff7b72', border: '#b62324' },
  Career: { bg: '#1f2a2d', text: '#79c0ff', border: '#1f6feb' },
  Business: { bg: '#2d2d1f', text: '#ffa657', border: '#bd561d' },
  Parenting: { bg: '#2d1f2d', text: '#d2a8ff', border: '#8957e5' },
  Lifestyle: { bg: '#1f2d2a', text: '#56d364', border: '#238636' },
  Tech: { bg: '#1a2233', text: '#58a6ff', border: '#0969da' },
  'Real Estate': { bg: '#2d241f', text: '#ffa657', border: '#bd561d' },
  Food: { bg: '#2a1f1f', text: '#ff9492', border: '#b62324' },
  Beauty: { bg: '#2d1f29', text: '#f778ba', border: '#bf4b8a' },
  Agriculture: { bg: '#1f2d1f', text: '#7ee787', border: '#238636' },
  Social: { bg: '#1f252d', text: '#79c0ff', border: '#1f6feb' },
  Psychology: { bg: '#261f2d', text: '#d2a8ff', border: '#8957e5' },
  Environment: { bg: '#1f2d22', text: '#56d364', border: '#196c2e' },
  Global: { bg: '#1f2430', text: '#58a6ff', border: '#1f6feb' },
}

function FlaskIcon({ color = '#7ec99a', size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H15L17 9L21 21H3L7 9L9 3Z"/>
      <path d="M9 3C9 3 10 6 12 6C14 6 15 3 15 3"/>
      <path d="M7 9H17"/>
    </svg>
  )
}

export default function MyLabPage() {
  const router = useRouter()
  const [items, setItems] = useState<LabItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved: LabItem[] = JSON.parse(localStorage.getItem('mylab') || '[]')
    setItems(saved)
  }, [])

  const handleRemove = (id: string) => {
    const updated = items.filter(p => p.id !== id)
    setItems(updated)
    localStorage.setItem('mylab', JSON.stringify(updated))
    window.dispatchEvent(new Event('mylab-update'))
  }

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
        <div className="font-mono text-lg" style={{ color: '#58a6ff' }}>
          <span style={{ color: '#3fb950' }}>$</span> loading<span style={{ animation: 'blink 1s infinite' }}>_</span>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: '#0d1117' }}>
      <style>{`
        @keyframes blink { 0%,49%,100%{opacity:1} 50%,99%{opacity:0} }
      `}</style>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12">

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 font-mono text-sm hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer p-0"
          style={{ color: '#58a6ff' }}>
          ← cd ..
        </button>

        <div className="mb-8 sm:mb-10 flex items-center gap-3">
          <FlaskIcon color="#7ec99a" size={24} />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono" style={{ color: '#e6edf3' }}>
              My Lab
            </h1>
            <p className="font-mono text-xs mt-1" style={{ color: '#484f58' }}>
              // 저장한 프롬프트 {items.length}개
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 font-mono" style={{ color: '#484f58' }}>
            <FlaskIcon color="#30363d" size={48} />
            <p className="mt-6 text-base" style={{ color: '#484f58' }}>아직 저장한 프롬프트가 없어요</p>
            <p className="text-sm mt-2">// 마음에 드는 프롬프트를 My Lab에 저장해보세요</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 px-4 py-2 rounded-lg font-mono text-sm transition-all hover:scale-105 active:scale-95"
              style={{ background: 'transparent', color: '#58a6ff', border: '1px solid #58a6ff' }}>
              프롬프트 탐색하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Other']
              return (
                <div key={item.id} className="rounded-xl overflow-hidden"
                  style={{ background: '#161b22', border: '1px solid #30363d' }}>
                  <div className="flex items-center px-3 pt-2.5" style={{ borderBottom: '1px solid #30363d' }}>
                    <div className="px-3 py-1.5 rounded-t-lg text-xs font-mono flex items-center gap-1.5"
                      style={{
                        background: '#0d1117', color: '#e6edf3',
                        border: '1px solid #30363d', borderBottom: '1px solid #0d1117', marginBottom: '-1px'
                      }}>
                      <span style={{ color: colors.text }}>◆</span>
                      <span>{item.title.substring(0, 16)}{item.title.length > 16 ? '...' : ''}.md</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold"
                        style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-bold font-mono mb-4 text-sm sm:text-base leading-snug"
                      style={{ color: '#e6edf3' }}>
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/prompts/${item.id}`)}
                        className="flex-1 py-2 rounded-lg font-mono text-xs transition-all hover:scale-[1.02] active:scale-95"
                        style={{ background: 'transparent', color: '#58a6ff', border: '1px solid #1f6feb' }}>
                        열기
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="flex-1 py-2 rounded-lg font-mono text-xs transition-all hover:scale-[1.02] active:scale-95"
                        style={{ background: 'transparent', color: '#8b949e', border: '1px solid #30363d' }}>
                        제거
                      </button>
                    </div>
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
