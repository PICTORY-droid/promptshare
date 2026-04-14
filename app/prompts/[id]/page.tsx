'use client'

import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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

export default function PromptDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    const fetchAndIncrement = async () => {
      const { id } = await params
      
      // Fetch prompt
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

      // Increment views
      await supabase
        .from('prompts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)
    }

    fetchAndIncrement()
  }, [params])

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLike = async () => {
    if (!prompt || isLiking) return
    setIsLiking(true)

    try {
      const { data, error } = await supabase
        .from('prompts')
        .update({ likes: (prompt.likes || 0) + 1 })
        .eq('id', prompt.id)
        .select()
        .single()

      if (error) throw error
      if (data) setPrompt(data)
    } catch (error) {
      alert('좋아요 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLiking(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-xl">로딩 중...</p>
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
        <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block font-medium">
          ← 돌아가기
        </Link>

        <article className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6 flex justify-between items-start">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full font-semibold">
              {prompt.category}
            </span>
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
                isLiking ? 'bg-gray-100' : 'hover:bg-pink-50 hover:border-pink-200'
              }`}
            >
              <span className="text-pink-500 text-xl">❤️</span>
              <span className="font-bold">{prompt.likes}</span>
            </button>
          </div>

          <h1 className="text-4xl font-bold mb-4">{prompt.title}</h1>

          <p className="text-xl text-gray-600 mb-8">{prompt.description}</p>

          <div className="flex flex-wrap gap-8 mb-8 text-gray-600 text-sm bg-gray-50 p-6 rounded-lg">
            <div>
              <span className="font-semibold block mb-1">작성자</span>
              <p className="text-base text-gray-900 font-medium">👤 {prompt.author_name}</p>
            </div>
            <div>
              <span className="font-semibold block mb-1">작성일</span>
              <p className="text-base text-gray-900 font-medium">📅 {date}</p>
            </div>
            <div>
              <span className="font-semibold block mb-1">조회수</span>
              <p className="text-base text-gray-900 font-medium">👁️ {prompt.views}</p>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">프롬프트 내용</h2>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap bg-gray-900 text-gray-100 p-8 rounded-xl font-mono leading-relaxed shadow-inner">
              {prompt.content}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleCopy}
              className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition shadow-md ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              {copied ? '✅ 복사되었습니다!' : '📋 프롬프트 복사하기'}
            </button>
          </div>
        </article>
      </div>
    </main>
  )
}
