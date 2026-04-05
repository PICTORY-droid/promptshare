'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreatePromptForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('prompts').insert([
        {
          title,
          description,
          content,
          category,
          author_name: authorName,
        },
      ])

      if (error) throw error

      setTitle('')
      setDescription('')
      setContent('')
      setCategory('General')
      setAuthorName('')
      alert('프롬프트가 성공적으로 공유되었습니다!')
      router.push('/')
    } catch (error) {
      alert('오류: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">프롬프트 공유하기</h1>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">작성자 이름</label>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="이름을 입력하세요"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="프롬프트 제목"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="프롬프트 설명"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">카테고리</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>General</option>
          <option>Writing</option>
          <option>Coding</option>
          <option>Marketing</option>
          <option>Education</option>
          <option>Other</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">프롬프트 본문</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="여기에 프롬프트를 입력하세요"
          rows={10}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? '공유 중...' : '프롬프트 공유'}
      </button>
    </form>
  )
}
