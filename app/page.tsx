'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import PromptCard from './components/PromptCard'

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

const COMMANDS = [
  '$ git commit -m "share your best prompt"',
  '$ npm run inspire --all',
  '$ curl https://promptshare.dev/api/prompts',
  '$ grep -r "best prompt" ./community',
  '$ ./run_creativity.sh --mode=infinite',
]

const ITEMS_PER_PAGE = 30

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [cmdIndex, setCmdIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const currentCmd = COMMANDS[cmdIndex]
    if (charIndex < currentCmd.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + currentCmd[charIndex])
        setCharIndex(prev => prev + 1)
      }, 50)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setDisplayText('')
        setCharIndex(0)
        setCmdIndex(prev => (prev + 1) % COMMANDS.length)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [charIndex, cmdIndex])

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const { data, error } = await supabase
          .from('prompts')
          .select('id, title, description, category, author_name, likes, views, created_at')
          .order('created_at', { ascending: false })

        if (error) {
          setFetchError(error.message)
        } else if (data) {
          setPrompts(data)
        }
      } catch (error) {
        setFetchError(error instanceof Error ? error.message : '알 수 없는 에러')
      } finally {
        setLoading(false)
      }
    }
    fetchPrompts()
  }, [])

  const totalPages = Math.ceil(prompts.length / ITEMS_PER_PAGE)
  const paginatedPrompts = prompts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen" style={{ background: '#0d1117' }}>
      {/* 히어로 섹션 */}
      <div className="border-b" style={{ borderColor: '#21262d', background: '#0d1117' }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* 터미널 창 */}
          <div className="rounded-xl overflow-hidden mb-8 glow-blue" style={{
            border: '1px solid #30363d',
            background: '#161b22',
            maxWidth: '600px'
          }}>
            <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#21262d' }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }}></div>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }}></div>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }}></div>
              </div>
              <span className="text-xs ml-2" style={{ color: '#8b949e', fontFamily: 'monospace' }}>terminal</span>
            </div>
            <div className="px-4 py-3" style={{ fontFamily: 'monospace', minHeight: '48px' }}>
              <span style={{ color: '#3fb950' }}>➜</span>
              <span style={{ color: '#58a6ff' }}> ~/promptshare</span>
              <span style={{ color: '#e6edf3' }}> {displayText}</span>
              <span className="blink" style={{ color: '#58a6ff' }}>█</span>
            </div>
          </div>

          <div className="fade-in-up">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>
              <span style={{ color: '#8b949e' }}>// </span>
              <span style={{ color: '#e6edf3' }}>프롬프트 </span>
              <span style={{ color: '#58a6ff' }}>공유</span>
              <span style={{ color: '#e6edf3' }}> 커뮤니티</span>
            </h1>
            <p className="text-lg mb-6" style={{ color: '#8b949e', fontFamily: 'monospace' }}>
              <span style={{ color: '#3fb950' }}>{'>'}</span> AI 프롬프트를 발견하고, 공유하고, 함께 성장하세요.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{
                background: '#161b22', border: '1px solid #30363d', color: '#8b949e', fontFamily: 'monospace'
              }}>
                <span style={{ color: '#3fb950' }}>●</span>
                <span>{prompts.length} prompts loaded</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{
                background: '#161b22', border: '1px solid #30363d', color: '#8b949e', fontFamily: 'monospace'
              }}>
                <span style={{ color: '#58a6ff' }}>◈</span>
                <span>open source community</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{
                background: '#161b22', border: '1px solid #30363d', color: '#8b949e', fontFamily: 'monospace'
              }}>
                <span style={{ color: '#f0883e' }}>⚡</span>
                <span>powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 프롬프트 목록 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span style={{ color: '#3fb950', fontFamily: 'monospace', fontSize: '1.2rem' }}>$</span>
          <span style={{ color: '#e6edf3', fontFamily: 'monospace', fontSize: '1.1rem' }}>ls -la ./prompts</span>
          <div className="h-px flex-1" style={{ background: '#21262d' }}></div>
          <span style={{ color: '#8b949e', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            total {prompts.length} | page {currentPage}/{totalPages}
          </span>
        </div>

        {fetchError && (
          <div className="px-4 py-3 rounded-lg mb-6 font-mono text-sm" style={{
            background: '#2d1b1b', border: '1px solid #f8514966', color: '#ff7b72'
          }}>
            <span style={{ color: '#ff7b72' }}>ERROR: </span>{fetchError}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block font-mono text-lg" style={{ color: '#58a6ff' }}>
              <span style={{ color: '#3fb950' }}>$</span> loading prompts
              <span className="blink">_</span>
            </div>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-20 font-mono">
            <p className="text-2xl mb-2" style={{ color: '#8b949e' }}>404: prompts not found</p>
            <p className="mb-6" style={{ color: '#58a6ff' }}>// 첫 번째 프롬프트를 공유해보세요!</p>
            <Link href="/create" className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{ background: '#238636', color: '#ffffff', border: '1px solid #3fb950' }}>
              $ new prompt
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedPrompts.map((prompt, index) => (
                <div key={prompt.id} className="fade-in-up"
                  style={{ animationDelay: `${(index % 9) * 0.05}s` }}>
                  <PromptCard prompt={prompt} />
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {/* 처음으로 */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded font-mono text-sm transition-all"
                  style={{
                    background: currentPage === 1 ? '#21262d' : '#161b22',
                    color: currentPage === 1 ? '#484f58' : '#8b949e',
                    border: '1px solid #30363d',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {'<<'}
                </button>

                {/* 이전 */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded font-mono text-sm transition-all"
                  style={{
                    background: currentPage === 1 ? '#21262d' : '#161b22',
                    color: currentPage === 1 ? '#484f58' : '#8b949e',
                    border: '1px solid #30363d',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {'<'}
                </button>

                {/* 페이지 번호 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (totalPages <= 7) return true
                    if (page === 1 || page === totalPages) return true
                    if (Math.abs(page - currentPage) <= 2) return true
                    return false
                  })
                  .reduce((acc: (number | string)[], page, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === 'number' && (page as number) - (arr[idx - 1] as number) > 1) {
                      acc.push('...')
                    }
                    acc.push(page)
                    return acc
                  }, [])
                  .map((item, idx) => (
                    item === '...' ? (
                      <span key={`dots-${idx}`} className="px-2 font-mono text-sm"
                        style={{ color: '#484f58' }}>...</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item as number)}
                        className="px-3 py-1.5 rounded font-mono text-sm transition-all hover:scale-105"
                        style={{
                          background: currentPage === item ? '#1f6feb' : '#161b22',
                          color: currentPage === item ? '#ffffff' : '#8b949e',
                          border: `1px solid ${currentPage === item ? '#58a6ff' : '#30363d'}`,
                          boxShadow: currentPage === item ? '0 0 10px #58a6ff44' : 'none'
                        }}
                      >
                        {item}
                      </button>
                    )
                  ))
                }

                {/* 다음 */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded font-mono text-sm transition-all"
                  style={{
                    background: currentPage === totalPages ? '#21262d' : '#161b22',
                    color: currentPage === totalPages ? '#484f58' : '#8b949e',
                    border: '1px solid #30363d',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  {'>'}
                </button>

                {/* 마지막으로 */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded font-mono text-sm transition-all"
                  style={{
                    background: currentPage === totalPages ? '#21262d' : '#161b22',
                    color: currentPage === totalPages ? '#484f58' : '#8b949e',
                    border: '1px solid #30363d',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  {'>>'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}