import { createClient } from '@supabase/supabase-js'
import HomeClient, { type Prompt } from './HomeClient'

// 60초마다 Vercel이 백그라운드에서 데이터 갱신 (ISR)
export const revalidate = 60

export default async function Home() {
  let prompts: Prompt[] = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from('prompts')
      .select('id, title, description, category, author_name, views, likes, created_at')
      .order('created_at', { ascending: false })
      .limit(2000)
    prompts = data ?? []
  } catch {
    // 빌드/갱신 중 Supabase 오류 시 빈 배열로 graceful 처리
  }

  return <HomeClient initialPrompts={prompts} />
}
