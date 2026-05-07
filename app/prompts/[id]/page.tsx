import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import PromptDetailClient from './PromptDetailClient'

type Props = { params: Promise<{ id: string }> }

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SITE_URL = 'https://promptlab.io.kr'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabaseServer
    .from('prompts')
    .select('title, description')
    .eq('id', id)
    .single()

  if (!data) {
    return {
      title: 'PromptLab - 프롬프트 공유 커뮤니티',
      description: 'AI 프롬프트를 발견하고, 공유하고, 함께 성장하세요.',
    }
  }

  const url = `${SITE_URL}/prompts/${id}`
  const title = `${data.title} | PromptLab`
  const description = data.description || 'AI 프롬프트를 발견하고, 공유하고, 함께 성장하세요.'

  return {
    title,
    description,
    openGraph: {
      title: data.title,
      description,
      url,
      siteName: 'PromptLab',
      type: 'article',
      images: [
        {
          url: `${SITE_URL}/og-image-v2.png`,
          width: 800,
          height: 800,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description,
      images: [`${SITE_URL}/og-image-v2.png`],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default function Page({ params }: Props) {
  return <PromptDetailClient />
}
