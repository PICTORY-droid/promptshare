import Link from 'next/link'

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Coding: { bg: '#1f2d3d', text: '#58a6ff', border: '#1f6feb' },
  Writing: { bg: '#2d1f3d', text: '#bc8cff', border: '#8957e5' },
  Marketing: { bg: '#2d1f1f', text: '#f0883e', border: '#bd561d' },
  Education: { bg: '#1f2d1f', text: '#3fb950', border: '#238636' },
  General: { bg: '#2d2d1f', text: '#d29922', border: '#9e6a03' },
  Other: { bg: '#1f2d2d', text: '#39c5cf', border: '#1b7c83' },
}

interface PromptCardProps {
  prompt: {
    id: string
    title: string
    description: string
    category: string
    author_name: string
    likes: number
    views: number
    created_at: string
  }
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const date = new Date(prompt.created_at).toLocaleDateString('ko-KR')
  const colors = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['Other']

  return (
    <Link href={`/prompts/${prompt.id}`}>
      <div
        className="rounded-xl p-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1 group"
        style={{
          background: '#161b22',
          border: '1px solid #30363d',
          fontFamily: 'monospace',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = colors.border
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 15px ${colors.border}33`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#30363d'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
        }}
      >
        {/* 상단 */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            {prompt.category}
          </span>
          <span className="text-xs" style={{ color: '#8b949e' }}>
            {date}
          </span>
        </div>

        {/* 제목 */}
        <h3
          className="text-base font-bold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
          style={{ color: '#e6edf3' }}
        >
          {prompt.title}
        </h3>

        {/* 설명 */}
        <p className="text-xs mb-4 line-clamp-2" style={{ color: '#8b949e' }}>
          {prompt.description}
        </p>

        {/* 하단 */}
        <div
          className="pt-3 flex items-center justify-between"
          style={{ borderTop: '1px solid #21262d' }}
        >
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: '#21262d', color: '#58a6ff' }}
            >
              {prompt.author_name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs" style={{ color: '#8b949e' }}>
              {prompt.author_name}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs" style={{ color: '#8b949e' }}>
            <span className="flex items-center gap-1">
              <span style={{ color: '#ff7b72' }}>♥</span>
              {prompt.likes}
            </span>
            <span className="flex items-center gap-1">
              <span style={{ color: '#8b949e' }}>◎</span>
              {prompt.views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}