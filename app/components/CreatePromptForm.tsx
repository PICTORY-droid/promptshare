'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'

const CATEGORY_COLORS: Record<string, string> = {
  General: '#d29922',
  Writing: '#bc8cff',
  Coding: '#58a6ff',
  Marketing: '#f0883e',
  Education: '#3fb950',
  Other: '#39c5cf',
}

function GlitchSubmitButton({ loading }: { loading: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const originalText = '▶ 프롬프트 공유하기'
  const loadingText = '⟳ 공유 중...'
  const glitchChars = '!@#$%^&*<>?/\\|[]{}~`'
  const [glitchText, setGlitchText] = useState(originalText)

  useEffect(() => {
    setGlitchText(loading ? loadingText : originalText)
  }, [loading])

  useEffect(() => {
    if (!isHovered || loading) {
      setGlitchText(loading ? loadingText : originalText)
      return
    }
    let iteration = 0
    const interval = setInterval(() => {
      setGlitchText(
        originalText.split('').map((char, index) => {
          if (char === ' ') return ' '
          if (index < iteration) return originalText[index]
          return glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }).join('')
      )
      if (iteration >= originalText.length) iteration = 0
      iteration += 0.5
    }, 50)
    return () => clearInterval(interval)
  }, [isHovered, loading])

  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full py-3 sm:py-4 rounded-xl font-mono font-bold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-95"
      style={{
        background: loading
          ? '#21262d'
          : isHovered
            ? 'linear-gradient(270deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000)'
            : 'linear-gradient(135deg, #238636, #2ea043)',
        backgroundSize: isHovered ? '400% 400%' : '100%',
        color: loading ? '#484f58' : '#ffffff',
        border: loading ? '1px solid #30363d' : isHovered ? '1px solid #bc8cff' : '1px solid #3fb950',
        boxShadow: loading ? 'none' : isHovered ? '0 0 15px #bc8cff66' : '0 0 20px #3fb95044',
        animation: isHovered && !loading ? 'rainbow 1s linear infinite' : 'none',
        cursor: loading ? 'not-allowed' : 'pointer'
      }}
    >
      {glitchText}
    </button>
  )
}

export default function CreatePromptForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const textarea = e.currentTarget
      const cursorPos = textarea.selectionStart
      const textBefore = content.substring(0, cursorPos)
      const textAfter = content.substring(cursorPos)
      const lines = textBefore.split('\n')
      const currentLine = lines[lines.length - 1]

      if (currentLine === '- ') {
        const newContent = textBefore.substring(0, textBefore.length - 2) + '\n' + textAfter
        setContent(newContent)
        setTimeout(() => {
          textarea.selectionStart = cursorPos - 2 + 1
          textarea.selectionEnd = cursorPos - 2 + 1
        }, 0)
        return
      }

      const newContent = textBefore + '\n- ' + textAfter
      setContent(newContent)
      setTimeout(() => {
        textarea.selectionStart = cursorPos + 3
        textarea.selectionEnd = cursorPos + 3
      }, 0)
    }
  }

  const handleContentBlur = () => {
    if (content === '- ') setContent('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('prompts').insert([{
        title, description, content, category, author_name: authorName,
      }])
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

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '8px',
    color: '#e6edf3',
    fontFamily: 'monospace',
    fontSize: '14px',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#8b949e',
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-0 px-3 sm:px-4 pt-3 rounded-t-xl overflow-x-auto" style={{
        background: '#161b22', border: '1px solid #30363d', borderBottom: 'none'
      }}>
        <div className="flex gap-1.5 mr-3 sm:mr-4 flex-shrink-0">
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }}></div>
          <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }}></div>
          <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }}></div>
        </div>
        <div className="px-3 sm:px-4 py-2 rounded-t-lg text-xs sm:text-sm font-mono flex items-center gap-2 flex-shrink-0" style={{
          background: '#0d1117', color: '#e6edf3',
          border: '1px solid #30363d', borderBottom: '1px solid #0d1117', marginBottom: '-1px'
        }}>
          <span style={{ color: CATEGORY_COLORS[category] }}>◆</span>
          <span>new_prompt.md</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: '#161b22', border: '1px solid #30363d',
        borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '20px'
      }}
        className="sm:p-8"
      >
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold font-mono mb-1" style={{ color: '#e6edf3' }}>
            <span style={{ color: '#8b949e' }}>// </span>
            <span style={{ color: '#58a6ff' }}>프롬프트</span>
            <span style={{ color: '#e6edf3' }}> 공유하기</span>
            <span className="blink" style={{ color: '#58a6ff' }}>_</span>
          </h1>
          <p className="text-xs font-mono" style={{ color: '#484f58' }}>
            // 당신의 최고의 프롬프트를 커뮤니티와 공유하세요
          </p>
        </div>

        <div className="mb-4 sm:mb-5">
          <label style={labelStyle}>
            <span style={{ color: '#58a6ff' }}>const</span>
            <span style={{ color: '#e6edf3' }}> authorName</span>
            <span style={{ color: '#8b949e' }}> = </span>
            <span style={{ color: '#f0883e' }}>"..."</span>
          </label>
          <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)}
            required style={inputStyle} placeholder="// 작성자 이름을 입력하세요"
            onFocus={e => e.target.style.borderColor = '#58a6ff'}
            onBlur={e => e.target.style.borderColor = '#30363d'} />
        </div>

        <div className="mb-4 sm:mb-5">
          <label style={labelStyle}>
            <span style={{ color: '#58a6ff' }}>const</span>
            <span style={{ color: '#e6edf3' }}> title</span>
            <span style={{ color: '#8b949e' }}> = </span>
            <span style={{ color: '#f0883e' }}>"..."</span>
          </label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            required style={inputStyle} placeholder="// 프롬프트 제목"
            onFocus={e => e.target.style.borderColor = '#58a6ff'}
            onBlur={e => e.target.style.borderColor = '#30363d'} />
        </div>

        <div className="mb-4 sm:mb-5">
          <label style={labelStyle}>
            <span style={{ color: '#58a6ff' }}>const</span>
            <span style={{ color: '#e6edf3' }}> description</span>
            <span style={{ color: '#8b949e' }}> = </span>
            <span style={{ color: '#f0883e' }}>"..."</span>
          </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="// 한 줄로 프롬프트를 설명해주세요" rows={3}
            onFocus={e => e.target.style.borderColor = '#58a6ff'}
            onBlur={e => e.target.style.borderColor = '#30363d'} />
        </div>

        <div className="mb-4 sm:mb-5">
          <label style={labelStyle}>
            <span style={{ color: '#58a6ff' }}>const</span>
            <span style={{ color: '#e6edf3' }}> category</span>
            <span style={{ color: '#8b949e' }}> = </span>
            <span style={{ color: CATEGORY_COLORS[category] }}>"{category}"</span>
          </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = '#58a6ff'}
            onBlur={e => e.target.style.borderColor = '#30363d'}>
            <option value="General">General</option>
            <option value="Writing">Writing</option>
            <option value="Coding">Coding</option>
            <option value="Marketing">Marketing</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-6 sm:mb-8">
          <label style={labelStyle}>
            <span style={{ color: '#58a6ff' }}>const</span>
            <span style={{ color: '#e6edf3' }}> content</span>
            <span style={{ color: '#8b949e' }}> = </span>
            <span style={{ color: '#f0883e' }}>`...`</span>
          </label>
          <div style={{ border: '1px solid #30363d', borderRadius: '8px', overflow: 'hidden', background: '#0d1117' }}>
            <div className="flex items-center justify-between px-3 py-1.5" style={{
              background: '#161b22', borderBottom: '1px solid #30363d'
            }}>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: '#ff5f57' }}></div>
                <div className="w-2 h-2 rounded-full" style={{ background: '#ffbd2e' }}></div>
                <div className="w-2 h-2 rounded-full" style={{ background: '#28c840' }}></div>
              </div>
              <span className="text-xs font-mono hidden sm:inline" style={{ color: '#484f58' }}>
                // 엔터 → - 자동생성 | 빈줄 엔터 → 목록종료
              </span>
              <span className="text-xs font-mono sm:hidden" style={{ color: '#484f58' }}>
                // 엔터 → - 자동
              </span>
            </div>
            <div className="flex">
              <div className="py-3 px-2 text-right select-none flex-shrink-0" style={{
                borderRight: '1px solid #21262d', minWidth: '36px', background: '#0d1117'
              }}>
                {(content || ' ').split('\n').map((_, i) => (
                  <div key={i} className="text-xs leading-6 font-mono" style={{ color: '#484f58' }}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="relative flex-1 min-w-0">
                <textarea value={content} onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleContentKeyDown} onBlur={handleContentBlur}
                  required rows={10}
                  style={{
                    width: '100%', padding: '12px 12px', background: 'transparent',
                    border: 'none', color: '#e6edf3', fontFamily: 'monospace',
                    fontSize: '13px', outline: 'none', resize: 'vertical', lineHeight: '1.5rem',
                  }} />
                {content === '' && (
                  <div className="absolute top-3 left-3 pointer-events-none font-mono text-xs sm:text-sm leading-6"
                    style={{ color: '#484f58' }}>
                    <p>- 엔터를 치면 다음 항목이 자동으로 생성됩니다</p>
                    <p>- 빈 줄에서 엔터를 치면 목록이 종료됩니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <GlitchSubmitButton loading={loading} />
      </form>
    </div>
  )
}