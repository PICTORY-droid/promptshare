'use client'

import { supabase } from '@/app/lib/supabase'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import GravityEffect from '@/app/components/GravityEffect'
import NeuralNetwork from '@/app/components/NeuralNetwork'
import HologramCard from '@/app/components/HologramCard'

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

function TypingAnimation() {
  const fullText = "// 최고의 AI 프롬프트를 공유하고 발견하세요"
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [glitchText, setGlitchText] = useState(fullText)
  const [isGlitching, setIsGlitching] = useState(false)
  const glitchChars = '!@#$%^&*<>?/\\|[]{}~`ﾊﾐﾋｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂ'

  useEffect(() => {
    if (!isTyping) return
    if (displayedText.length < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1))
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setIsTyping(false)
    }
  }, [displayedText, isTyping, fullText])

  useEffect(() => {
    if (isTyping) return
    const scheduleRef = { current: null as ReturnType<typeof setTimeout> | null }
    const triggerGlitch = () => {
      setIsGlitching(true)
      let count = 0
      const interval = setInterval(() => {
        setGlitchText(
          fullText.split('').map((char) => {
            if (char === ' ' || char === '/') return char
            return Math.random() > 0.3 ? char : glitchChars[Math.floor(Math.random() * glitchChars.length)]
          }).join('')
        )
        count++
        if (count >= 6) {
          clearInterval(interval)
          setGlitchText(fullText)
          setIsGlitching(false)
          scheduleRef.current = setTimeout(triggerGlitch, 2000 + Math.random() * 4000)
        }
      }, 60)
    }
    scheduleRef.current = setTimeout(triggerGlitch, 2000 + Math.random() * 3000)
    return () => { if (scheduleRef.current) clearTimeout(scheduleRef.current) }
  }, [isTyping])

  const shown = isTyping ? displayedText : (isGlitching ? glitchText : fullText)

  return (
    <p className="text-sm font-mono" style={{ color: isGlitching ? '#8b949e' : '#484f58', minHeight: '1.5em', transition: 'color 0.1s' }}>
      {shown}
      {isTyping && <span style={{ color: '#58a6ff', animation: 'blink 1s infinite' }}>▍</span>}
    </p>
  )
}

function PromptCard({ prompt, index, currentPage, selectedCategory, searchQuery }: {
  prompt: Prompt
  index: number
  currentPage: number
  selectedCategory: string
  searchQuery: string
}) {
  const colors = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['Other']
  const date = new Date(prompt.created_at).toLocaleDateString('ko-KR')
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            }, index * 80)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  const handleClick = () => {
    const params = new URLSearchParams()
    if (currentPage > 1) params.set('page', String(currentPage))
    if (selectedCategory !== 'All') params.set('category', selectedCategory)
    if (searchQuery.trim()) params.set('q', searchQuery)
    const queryStr = params.toString()
    router.replace(queryStr ? `/?${queryStr}` : '/', { scroll: false })
    router.push(`/prompts/${prompt.id}`)
  }

  return (
    <div
      ref={ref}
      className="prompt-card"
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        opacity: 0,
        transform: 'translateY(24px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div className="rounded-xl overflow-hidden cursor-pointer"
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
    </div>
  )
}

function HomeInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'All')
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
  const [showCategories, setShowCategories] = useState(false)
  const [currentPage, setCurrentPage] = useState(() => {
    const page = parseInt(searchParams.get('page') || '1', 10)
    return isNaN(page) || page < 1 ? 1 : page
  })
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const updateURL = (page: number, category: string, query: string) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', String(page))
    if (category !== 'All') params.set('category', category)
    if (query.trim()) params.set('q', query)
    const queryStr = params.toString()
    router.replace(queryStr ? `/?${queryStr}` : '/', { scroll: false })
  }

  const filtered = prompts.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const itemsPerPage = isSmallScreen ? 20 : 30
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPrompts = filtered.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateURL(page, selectedCategory, searchQuery)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
    updateURL(1, cat, searchQuery)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    updateURL(1, selectedCategory, searchQuery)
    if (searchQuery.trim()) {
      document.querySelector('.grid')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getPaginationButtons = () => {
    const buttons = []
    const maxButtons = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
    let endPage = Math.min(totalPages, startPage + maxButtons - 1)
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1)
    }
    if (startPage > 1) {
      buttons.push(
        <button key="first" onClick={() => handlePageChange(1)}
          className="px-2 py-1 sm:px-3 sm:py-2 rounded font-mono text-xs sm:text-sm"
          style={{ background: 'transparent', color: '#8b949e', border: '1px solid #30363d' }}>
          ◀ first
        </button>
      )
    }
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={i} onClick={() => handlePageChange(i)}
          className="px-2 py-1 sm:px-3 sm:py-2 rounded font-mono text-xs sm:text-sm transition-all hover:scale-105"
          style={{
            background: currentPage === i ? '#58a6ff' : 'transparent',
            color: currentPage === i ? '#0d1117' : '#8b949e',
            border: `1px solid ${currentPage === i ? '#58a6ff' : '#30363d'}`,
            fontWeight: currentPage === i ? 'bold' : 'normal',
          }}>
          {i}
        </button>
      )
    }
    if (endPage < totalPages) {
      buttons.push(
        <button key="last" onClick={() => handlePageChange(totalPages)}
          className="px-2 py-1 sm:px-3 sm:py-2 rounded font-mono text-xs sm:text-sm"
          style={{ background: 'transparent', color: '#8b949e', border: '1px solid #30363d' }}>
          last ▶
        </button>
      )
    }
    return buttons
  }

  return (
    <main className="min-h-screen" style={{ background: '#0d1117' }}>
      <GravityEffect />
      <NeuralNetwork />
      <HologramCard />
      <style>{`
        @keyframes blink {
          0%, 49%, 100% { opacity: 1; }
          50%, 99% { opacity: 0; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12">

        <div className="mb-8 sm:mb-12 text-center">
          <TypingAnimation />
        </div>

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
              background: 'transparent',
              color: '#3fb950',
              border: '2px solid #3fb950',
              boxShadow: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.boxShadow = '0 0 15px #3fb95066'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#3fb950'
              e.currentTarget.style.boxShadow = 'none'
            }}>
            🔍 search
          </button>
        </div>

        <div className="hidden sm:flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => {
            const colors = cat === 'All' ? null : CATEGORY_COLORS[cat]
            const isActive = selectedCategory === cat
            return (
              <button key={cat} onClick={() => handleCategoryChange(cat)}
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

        <div className="sm:hidden mb-6">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="w-full px-4 py-2.5 rounded-xl font-mono font-bold text-sm transition-all flex items-center justify-between"
            style={{ background: '#161b22', color: '#58a6ff', border: '1px solid #30363d' }}>
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
                    <button key={cat}
                      onClick={() => { handleCategoryChange(cat); setShowCategories(false) }}
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {paginatedPrompts.map((prompt, index) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  index={index}
                  currentPage={currentPage}
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                {getPaginationButtons()}
              </div>
            )}

            <div className="text-center mt-6 font-mono text-xs sm:text-sm" style={{ color: '#484f58' }}>
              <span style={{ color: '#8b949e' }}>
              </span>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
        <div className="font-mono text-lg" style={{ color: '#58a6ff' }}>
          <span style={{ color: '#3fb950' }}>$</span> loading<span style={{ animation: 'blink 1s infinite' }}>_</span>
        </div>
      </main>
    }>
      <HomeInner />
    </Suspense>
  )
}
