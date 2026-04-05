'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import PromptCard from './components/PromptCard'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">PromptShare</h1>
          <Link
            href="/create"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-semibold"
          >
            + 프롬프트 공유
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">프롬프트 공유 커뮤니티</h2>
          <p className="text-gray-600 text-lg">
            AI 프롬프트를 발견하고, 공유하고, 함께 성장하세요.
          </p>
        </div>

        {fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>에러: {fetchError}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">로딩 중...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl mb-4">아직 프롬프트가 없습니다.</p>
            <Link
              href="/create"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              첫 프롬프트 공유하기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
