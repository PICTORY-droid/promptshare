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

export default function PromptList() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetchPrompts()
  }, [category])

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

  return (
    <div>
      <div className="mb-8 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              category === cat
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">프롬프트가 없습니다. 첫 번째 프롬프트를 공유해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  )
}
