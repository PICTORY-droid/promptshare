import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generateSlug() {
  return Math.random().toString(36).substring(2, 8)
}

function generateSystemPrompt(name: string, role: string, tone: string, expertise: string, forbidden: string) {
  const toneMap: Record<string, string> = {
    friendly: '친근하고 따뜻하게',
    professional: '전문적이고 격식있게',
    concise: '간결하고 핵심만',
    funny: '유쾌하고 재미있게',
  }
  const toneText = toneMap[tone] || tone

  return `당신은 ${name}입니다.

[역할]
${role}

[말투]
항상 ${toneText} 대화하세요.

[전문 분야]
${expertise || '없음'}

[행동 규칙]
- 모르는 것은 모른다고 솔직하게 말하세요
- 답변은 명확하고 도움이 되게 하세요
- 사용자의 질문 의도를 파악하고 핵심을 답하세요
${forbidden ? `- 절대 다루지 않을 주제: ${forbidden}` : ''}

[첫 인사]
대화 시작 시 반드시 이렇게 인사하세요:
"안녕하세요! 저는 ${name}입니다. ${expertise ? expertise + ' 관련 ' : ''}무엇이든 도와드릴게요! 😊"`
}

export async function POST(req: NextRequest) {
  try {
    const { name, role, tone, expertise, forbidden, userId } = await req.json()

    if (!name || !role || !tone || !userId) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 })
    }

    const system_prompt = generateSystemPrompt(name, role, tone, expertise || '', forbidden || '')

    let slug = generateSlug()
    let attempts = 0
    while (attempts < 5) {
      const { data: existing } = await supabase.from('persona_cards').select('slug').eq('slug', slug).single()
      if (!existing) break
      slug = generateSlug()
      attempts++
    }

    const { data, error } = await supabase.from('persona_cards').insert({
      user_id: userId,
      slug,
      name,
      role,
      tone,
      expertise: expertise || '',
      forbidden: forbidden || '',
      system_prompt,
    }).select().single()

    if (error) throw error

    return NextResponse.json({ slug: data.slug, system_prompt: data.system_prompt })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
