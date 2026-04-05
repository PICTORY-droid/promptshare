'use client'

import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

export default function PromptDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrompt = async () => {
      const { id } = await params
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        notFound()
      }

      setPrompt(data)
      setLoading(false)
    }

    fetchPrompt()
  }, [params])

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </main>
    )
  }

  if (!prompt) {
    return notFound()
  }

  const date = new Date(prompt.created_at).toLocaleDateString('ko-KR')

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            PromptShare
          </Link>
          <Link
            href="/create"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-semibold"
          >
            + 프롬프트 공유
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">
          ← 돌아가기
        </Link>

        <article className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full font-semibold">
              {prompt.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{prompt.title}</h1>

          <p className="text-xl text-gray-600 mb-8">{prompt.description}</p>

          <div className="flex gap-8 mb-8 text-gray-600 text-sm">
            <div>
              <span className="font-semibold">작성자</span>
              <p>👤 {prompt.author_name}</p>
            </div>
            <div>
              <span className="font-semibold">작성일</span>
              <p>📅 {date}</p>
            </div>
            <div>
              <span className="font-semibold">좋아요</span>
              <p>❤️ {prompt.likes}</p>
            </div>
            <div>
              <span className="font-semibold">조회수</span>
              <p>👁️ {prompt.views}</p>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">프롬프트 내용</h2>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap bg-gray-50 p-6 rounded-lg border border-gray-200">
              {prompt.content}
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleCopy}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {copied ? '✅ 복사되었습니다!' : '📋 프롬프트 복사'}
            </button>
          </div>
        </article>
      </div>
    </main>
  )
}
