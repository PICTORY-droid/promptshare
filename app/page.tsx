'use client'

import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { useState, useEffect } from 'react'

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

const CATEGORIES = ['All', 'General', 'Writing', 'Coding', 'Marketing', 'Education', 'Other']

function PromptCard({ prompt }: { prompt: Prompt }) {
  const colors = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['Other']
  const date = new Date(prompt.created_at).toLocaleDateString('ko-KR')

  return (
    <Link href={`/prompts/${prompt.id}`}>
      <div className="rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
        style={{ background: '#161b22', border: '1px solid #30363d' }}>
        <div className="flex items-center px-3 pt-2.5" style={{ borderBottom: '1px solid #30363d' }}>
          <div className="px-3 py-1.5 rounded-t-lg text-xs font-mono flex items-center gap-1.5"
            style={{
              background: '#0d1117', color: '#e6edf3',
              border: '1px solid #30363d', borderBottom: '1px solid #0d1117', marginBottom: '-1px'
            }}>
            <span style={{ color: colors.text }}>◆</span>
            <span>{prompt.title.substring(0, 16)}{prompt.title.length > 16 ? '...' : ''}.md</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold"
              style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
              {prompt.category}
            </span>
            <span className="text-xs font-mono" style={{ color: '#484f58' }}>{date}</span>
          </div>

          <h3 className="font-bold font-mono mb-1.5 text-sm sm:text-base leading-snug"
            style={{ color: '#e6edf3' }}>
            {prompt.title}
          </h3>
          <p className="text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2"
            style={{ color: '#8b949e' }}>
            {prompt.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#21262d', color: '#58a6ff' }}>
                {prompt.author_name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-mono" style={{ color: '#8b949e' }}>{prompt.author_name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono" style={{ color: '#484f58' }}>
              <span>♥ {prompt.likes}</span>
              <span>◎ {prompt.views}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCategories, setShowCategories] = useState(false)

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setPrompts(data)
      setLoading(false)
    }
    fetchPrompts()
  }, [])

  const filtered = prompts.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    if (searchQuery.trim()) {
      document.querySelector('.grid')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen" style={{ background: '#0d1117' }}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12">

        {/* 헤더 - 제목만 표시 (설명 텍스트 유지) */}
        <div className="mb-8 sm:mb-12 text-center">
          <p className="text-sm font-mono" style={{ color: '#484f58' }}>
            // 최고의 AI 프롬프트를 공유하고 발견하세요
          </p>
        </div>

        {/* 검색 + 검색 버튼 */}
        <div className="flex gap-2 mb-5 sm:mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm"
              style={{ color: '#3fb950' }}>$</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="// 프롬프트 검색..."
              style={{
                width: '100%', padding: '10px 12px 10px 28px',
                background: '#161b22', border: '1px solid #30363d',
                borderRadius: '10px', color: '#e6edf3',
                fontFamily: 'monospace', fontSize: '14px', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = '#30363d'}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 rounded-xl font-mono font-bold text-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #238636, #2ea043)',
              color: '#ffffff', border: '1px solid #3fb950',
              boxShadow: '0 0 15px #3fb95033',
            }}>
            🔍 search
          </button>
        </div>

        {/* 카테고리 필터 - 데스크톱 */}
        <div className="hidden sm:flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => {
            const colors = cat === 'All' ? null : CATEGORY_COLORS[cat]
            const isActive = selectedCategory === cat
            return (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className="px-3 py-1.5 rounded-full font-mono text-xs font-semibold transition-all hover:scale-105 whitespace-nowrap flex-shrink-0"
                style={{
                  background: isActive ? (colors?.bg || '#21262d') : 'transparent',
                  color: isActive ? (colors?.text || '#e6edf3') : '#484f58',
                  border: `1px solid ${isActive ? (colors?.border || '#30363d') : '#21262d'}`,
                }}>
                {cat}
              </button>
            )
          })}
        </div>

        {/* 카테고리 필터 - 모바일 토글 */}
        <div className="sm:hidden mb-6">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="w-full px-4 py-2.5 rounded-xl font-mono font-bold text-sm transition-all flex items-center justify-between"
            style={{
              background: '#161b22',
              color: '#58a6ff',
              border: '1px solid #30363d',
            }}>
            <span>{selectedCategory === 'All' ? '📂 All Categories' : `📂 ${selectedCategory}`}</span>
            <span style={{ marginLeft: '8px' }}>{showCategories ? '▼' : '▶'}</span>
          </button>

          {showCategories && (
            <div className="mt-2 p-3 rounded-xl" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => {
                  const colors = cat === 'All' ? null : CATEGORY_COLORS[cat]
                  const isActive = selectedCategory === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat)
                        setShowCategories(false)
                      }}
                      className="px-3 py-1.5 rounded-full font-mono text-xs font-semibold transition-all active:scale-95"
                      style={{
                        background: isActive ? (colors?.bg || '#21262d') : 'transparent',
                        color: isActive ? (colors?.text || '#e6edf3') : '#484f58',
                        border: `1px solid ${isActive ? (colors?.border || '#30363d') : '#21262d'}`,
                      }}>
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* 목록 */}
        {loading ? (
          <div className="text-center py-20 font-mono" style={{ color: '#58a6ff' }}>
            <span style={{ color: '#3fb950' }}>$</span> loading prompts
            <span className="blink">_</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 font-mono" style={{ color: '#484f58' }}>
            <p>// 프롬프트가 없습니다</p>
            <p className="text-sm mt-2">// 첫 번째 프롬프트를 공유해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
