import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, title, description, content, category, author_name, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  const SITE_URL = 'https://promptlab.io.kr'

  const items = (prompts || []).map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE_URL}/prompts/${p.id}</link>
      <guid>${SITE_URL}/prompts/${p.id}</guid>
      <description><![CDATA[${p.description || p.content.substring(0, 200)}]]></description>
      <category>${p.category}</category>
      <author>${p.author_name}</author>
      <pubDate>${new Date(p.created_at).toUTCString()}</pubDate>
    </item>`).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PromptLab - AI 프롬프트 학습 플랫폼</title>
    <link>${SITE_URL}</link>
    <description>프롬프트를 제대로 알면 AI 수준이 달라진다</description>
    <language>ko</language>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og-image-v2.png</url>
      <title>PromptLab</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
