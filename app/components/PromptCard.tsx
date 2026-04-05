import Link from 'next/link'

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

  return (
    <Link href={`/prompts/${prompt.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer">
        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
            {prompt.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{prompt.title}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{prompt.description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>👤 {prompt.author_name}</span>
          <span>📅 {date}</span>
        </div>
        
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <span>❤️ {prompt.likes}</span>
          <span>👁️ {prompt.views}</span>
        </div>
      </div>
    </Link>
  )
}
