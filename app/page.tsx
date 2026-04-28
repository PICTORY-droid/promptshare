'use client'

import { supabase } from '@/app/lib/supabase'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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

const CATEGORIES = ['All', 'Coding', 'Marketing', 'Writing', 'Education', 'General', 'Other', 'Finance', 'Legal', 'Health', 'Career', 'Business', 'Parenting', 'Lifestyle', 'Tech', 'Real Estate', 'Food', 'Beauty', 'Agriculture', 'Social', 'Psychology', 'Environment', 'Global']

function TypingAnimation() {
  const fullText = "// 프롬프트를 제대로 알면 AI 수준이 달라진다"
  const [scanProgress, setScanProgress] = useState(0)
  const [scanDone, setScanDone] = useState(false)
  const [glitchText, setGlitchText] = useState(fullText)
  const [isGlitching, setIsGlitching] = useState(false)
  const glitchChars = '!@#$%^&*<>?/\\|[]{}~`ﾊﾐﾋｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂ'

  useEffect(() => {
    let rafId: number
    let glitchTimer: ReturnType<typeof setTimeout> | null = null
    let glitchInterval: ReturnType<typeof setInterval> | null = null
    let cycleTimer: ReturnType<typeof setTimeout> | null = null
    let pauseTimer: ReturnType<typeof setTimeout> | null = null
    let destroyed = false

    const clearAll = () => {
      cancelAnimationFrame(rafId)
      if (glitchTimer) clearTimeout(glitchTimer)
      if (glitchInterval) clearInterval(glitchInterval)
      if (cycleTimer) clearTimeout(cycleTimer)
      if (pauseTimer) clearTimeout(pauseTimer)
    }

    const triggerGlitch = () => {
      if (destroyed) return
      setIsGlitching(true)
      let count = 0
      glitchInterval = setInterval(() => {
        setGlitchText(
          fullText.split('').map((char) => {
            if (char === ' ' || char === '/') return char
            return Math.random() > 0.3 ? char : glitchChars[Math.floor(Math.random() * glitchChars.length)]
          }).join('')
        )
        count++
        if (count >= 6) {
          clearInterval(glitchInterval!)
          glitchInterval = null
          setGlitchText(fullText)
          setIsGlitching(false)
          if (!destroyed) {
            glitchTimer = setTimeout(triggerGlitch, 2000 + Math.random() * 3000)
          }
        }
      }, 60)
    }

    const onScanDone = () => {
      if (destroyed) return
      glitchTimer = setTimeout(triggerGlitch, 1500 + Math.random() * 2000)
      cycleTimer = setTimeout(() => {
        if (destroyed) return
        if (glitchTimer) clearTimeout(glitchTimer)
        if (glitchInterval) { clearInterval(glitchInterval); glitchInterval = null }
        setIsGlitching(false)
        setGlitchText(fullText)
        pauseTimer = setTimeout(startScan, 3000)
      }, 5500)
    }

    function startScan() {
      if (destroyed) return
      setScanProgress(0)
      setScanDone(false)
      setIsGlitching(false)
      setGlitchText(fullText)
      const start = performance.now()
      const tick = (now: number) => {
        if (destroyed) return
        const t = Math.min((now - start) / 1500, 1)
        setScanProgress(t * 100)
        if (t < 1) {
          rafId = requestAnimationFrame(tick)
        } else {
          setScanDone(true)
          onScanDone()
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    startScan()
    return () => { destroyed = true; clearAll() }
  }, [])

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <p className="text-sm font-mono" style={{ color: 'transparent', margin: 0, userSelect: 'none', pointerEvents: 'none' }}>
        {fullText}
      </p>
      <p
        className="text-sm font-mono"
        style={{
          position: 'absolute', top: 0, left: 0, margin: 0,
          color: isGlitching ? '#8b949e' : '#484f58',
          transition: 'color 0.1s',
          clipPath: scanDone ? 'none' : `inset(0 0 ${100 - scanProgress}% 0)`,
          whiteSpace: 'nowrap',
        }}
      >
        {isGlitching ? glitchText : fullText}
      </p>
      {!scanDone && (
        <div
          style={{
            position: 'absolute',
            left: '-8px', right: '-8px',
            top: `calc(${scanProgress}% - 1px)`,
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #7ec99a 20%, #c8f7d8 50%, #7ec99a 80%, transparent 100%)',
            boxShadow: '0 0 6px #7ec99a, 0 0 14px #7ec99a88',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

function CategoryTyping() {
  const fullText = '카테고리'
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  return (
    <span>
      {displayed}
      <span style={{ opacity: done ? undefined : 1, animation: done ? 'blink 1s infinite' : 'none' }}>▍</span>
    </span>
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
          </div>

          <h3 className="font-bold font-mono mb-1.5 text-sm sm:text-base leading-snug"
            style={{ color: '#e6edf3' }}>
            {prompt.title}
          </h3>
          <p className="text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2"
            style={{ color: '#8b949e' }}>
            {prompt.description}
          </p>

          <div className="flex items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#21262d', color: '#58a6ff' }}>
                {prompt.author_name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-mono" style={{ color: '#8b949e' }}>{prompt.author_name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HomeInner() {
  const router = useRouter()

  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCategories, setShowCategories] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const pathname = usePathname()
  const fetchPrompts = async () => {
    console.log('fetchPrompts 실행됨')
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2000)
      if (!error && data) setPrompts(data)
    } catch (e) {
      console.error('fetchPrompts error:', e)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchPrompts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) { setLoading(true); fetchPrompts() }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateURL = (page: number, category: string, query: string, sort: string = sortBy) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', String(page))
    if (category !== 'All') params.set('category', category)
    if (query.trim()) params.set('q', query)
    if (sort !== 'latest') params.set('sort', sort)
    const queryStr = params.toString()
    router.replace(queryStr ? `/?${queryStr}` : '/', { scroll: false })
  }

  const handleSortChange = (sort: 'latest' | 'popular') => {
    setSortBy(sort)
    setCurrentPage(1)
    updateURL(1, selectedCategory, searchQuery, sort)
  }

  const filtered = prompts
    .filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author_name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
    .sort((a, b) => sortBy === 'popular' ? (b.views - a.views) : 0)

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
    if (endPage - startPage + 1 < maxButtons) startPage = Math.max(1, endPage - maxButtons + 1)
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
        @keyframes blink { 0%, 49%, 100% { opacity: 1; } 50%, 99% { opacity: 0; } }
        input::placeholder { color: #484f58; }
      `}</style>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10">


        {/* 검색바 + 카테고리 한 줄 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center gap-1 whitespace-nowrap"
            style={{ background: '#161b22', color: '#484f58', border: '1px solid #30363d', borderRadius: '10px', padding: '8px 10px', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', minWidth: '90px' }}>
            <span style={{ flex: 1, textAlign: 'left' }}>{selectedCategory === 'All' ? <CategoryTyping /> : selectedCategory}</span>
            <span style={{ fontSize: '10px', marginLeft: '4px' }}>{showCategories ? '▼' : '▶'}</span>
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="단어로 검색하세요"
              style={{
                width: '100%', padding: '8px 12px',
                background: '#161b22', border: '1px solid #30363d',
                borderRadius: '10px', color: '#e6edf3',
                fontFamily: 'monospace', fontSize: '13px', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = '#30363d'}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-3 py-2 rounded-xl font-mono font-bold text-sm transition-all hover:scale-105 active:scale-95"
            style={{ background: 'transparent', color: '#3fb950', border: '2px solid #3fb950' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 15px #3fb95066' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#3fb950'; e.currentTarget.style.boxShadow = 'none' }}>
            🔍
          </button>
        </div>

        {/* 카테고리 드롭다운 */}
        {showCategories && (
          <div className="mb-4 p-3 rounded-xl" style={{ background: '#161b22', border: '1px solid #30363d' }}>
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

        <div className="flex items-center gap-1 mb-4" style={{ borderBottom: '1px solid #21262d' }}>
          {(['latest', 'popular'] as const).map((tab) => (
            <button key={tab} onClick={() => handleSortChange(tab)}
              className="px-4 py-2 font-mono text-xs transition-all"
              style={{
                background: 'transparent',
                color: sortBy === tab ? '#58a6ff' : '#484f58',
                border: 'none',
                borderBottom: sortBy === tab ? '2px solid #58a6ff' : '2px solid transparent',
                cursor: 'pointer', marginBottom: '-1px',
              }}>
              {tab === 'latest' ? '// 최신순' : '// 인기순'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 font-mono" style={{ color: '#58a6ff' }}>
            <span style={{ color: '#3fb950' }}>$</span> loading prompts<span className="blink">_</span>
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
                <PromptCard key={prompt.id} prompt={prompt} index={index}
                  currentPage={currentPage} selectedCategory={selectedCategory} searchQuery={searchQuery} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                {getPaginationButtons()}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <HomeInner />
  )
}
