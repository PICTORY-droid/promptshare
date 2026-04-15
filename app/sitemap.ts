import { MetadataRoute } from 'next'
import { supabase } from '@/app/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://promptshare-woad.vercel.app'

  // 프롬프트 목록 가져오기
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, created_at')

  const promptUrls = prompts?.map((prompt) => ({
    url: `${baseUrl}/prompts/${prompt.id}`,
    lastModified: new Date(prompt.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...promptUrls,
  ]
}