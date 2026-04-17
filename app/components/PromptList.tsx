'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import PromptCard from './PromptCard'

interface Prompt {
  id: string
  title: string
  description: string
  category: string
  author_name: string
  likes: number
  views: number
  created_at: string
}

const ITEMS_PER_PAGE = 27

export default function PromptList() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [chevronBlink, setChevronBlink] = useState(true)

  useEffect(() => {
    fetchPrompts()
  }, [category])

  useEffect(() => {
    setCurrentPage(1)
  }, [category])

  useEffect(() => {
    const interval = setInterval(() => {
      setChevronBlink(prev => !prev)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const fetchPrompts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('prompts')
        .select('id, title, description, category, author_name, likes, views, created_at')
        .order('created_at', { ascending: false })

      if (category !== 'All') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.error('Supabase error:', error)
        setPrompts([])
      } else {
        setPrompts(data || [])
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
      setPrompts([])
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', 'General', 'Writing', 'Coding', 'Marketing', 'Education', 'Other']

  const totalPages = Math.ceil(prompts.length / ITEMS_PER_PAGE)
  const paginatedPrompts = prompts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      const pages = []
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    if (currentPage <= 3) return [1, 2, 3, 4, 5]
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
  }

  const chevronStyle = {
    opacity: chevronBlink ? 1 : 0.2,
    transition: 'opacity 0.3s',
  }

  const btnBase: React.CSSProperties = {
    fontFamily: 'monospace',
    fontSize: '13px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #30363d',
    background: 'transparent',
    color: '#8b949e',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '36px',
  }

  const btnActive: React.CSSProperties = {
    ...btnBase,
    border: '1px solid #8b949e',
    color: '#e6edf3',
    background: '#21262d',
  }

  const btnDisabled: React.CSSProperties = {
    ...btnBase,
    opacity: 0.2,
    cursor: 'not-allowed',
  }

  return (
    <div>
      {/* 카테고리 필터 */}
      <div className="mb-8 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '6px 14px',
              borderRadius: '999px',
              border: category === cat ? '1px solid #8b949e' : '1px solid #30363d',
              background: category === cat ? '#21262d' : 'transparent',
              color: category === cat ? '#e6edf3' : '#8b949e',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 font-mono" style={{ color: '#8b949e' }}>
          <span style={{ color: '#8b949e' }}>$</span> loading
          <span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-12 font-mono" style={{ color: '#484f58' }}>
          // 프롬프트가 없습니다. 첫 번째 프롬프트를 공유해보세요!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1">

                {/* 처음으로 */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  style={currentPage === 1 ? btnDisabled : btnBase}
                >
                  «
                </button>

                {/* 이전 */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={currentPage === 1 ? btnDisabled : btnBase}
                >
                  <span style={currentPage === 1 ? {} : chevronStyle}>◄</span>
                </button>

                {/* 페이지 번호 — 항상 5개 */}
                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={page === currentPage ? btnActive : btnBase}
                  >
                    {page}
                  </button>
                ))}

                {/* 다음 */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={currentPage === totalPages ? btnDisabled : btnBase}
                >
                  <span style={currentPage === totalPages ? {} : chevronStyle}>►</span>
                </button>

                {/* 마지막으로 */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  style={currentPage === totalPages ? btnDisabled : btnBase}
                >
                  »
                </button>

              </div>

              {/* 페이지 정보 */}
              <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#484f58' }}>
                // page {currentPage} of {totalPages} · {prompts.length} total prompts
              </div>

            </div>
          )}
        </>
      )}
    </div>
  )
}