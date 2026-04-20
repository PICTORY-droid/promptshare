import os
import json
import time
from datetime import date
from google import genai
from supabase import create_client

# ==========================================
# 설정
# ==========================================
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://hkijkcoshdzzmaxiihzm.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

TODAY = date.today().isoformat()  # e.g. "2026-04-20"

REWRITE_SYSTEM_PROMPT = """당신은 PromptLab 콘텐츠 편집 전문가입니다.
아래 글을 다음 기준으로 전면 재작성하고 JSON으로만 반환하세요.

## 재작성 기준
1. 제목: 타겟(직종/세대/상황) + 키워드(방법/이유/체크리스트/비교/실수/현실/전략 중 1개) 조합
   - 특정 연도 절대 금지 (2024년, 2025년 등)
   - 딱 떨어지는 숫자 금지
2. 설명: 2문장 핵심 요약 (구체적 이득 + 적용 대상 명시)
3. 본문 구조:
   - 한줄결론 (가장 중요한 핵심 1문장)
   - 실행 3단계 (단계별 구체적 행동)
   - 체크리스트 (5~7개 항목)
   - 예시 (실제 상황에 맞는 구체적 예시)
   - CTA: "이 정보가 필요한 분께 공유해보세요"
4. 모든 고정 수치/법령/금리/임금 → 변수 처리
   - 예: {{최저임금}}, {{세율}}, {{금리}}, {{만점}} 등
5. AI 티 나는 문장 금지 (예: "중요합니다", "필수적입니다", "효과적입니다" 등 상투어)
6. 대괄호 [ ] 절대 금지
7. 변수 4개 이상 포함
8. 각 섹션 150자 이상

## 반환 형식 (JSON만, 다른 텍스트 금지)
{
  "title": "재작성된 제목",
  "description": "재작성된 설명 (2문장)",
  "content": "재작성된 본문 전체"
}"""


def main():
    print(f"오늘 날짜: {TODAY}")
    print("Supabase 및 Gemini 초기화 중...")

    client = genai.Client(api_key=GEMINI_API_KEY)
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # last_auto_update IS NULL인 글 created_at 오래된 순 10개 조회
    print("재작성 대상 글 조회 중...")
    result = (
        supabase.table("prompts")
        .select("id, title, description, content, category")
        .is_("last_auto_update", "null")
        .order("created_at", desc=False)
        .limit(10)
        .execute()
    )

    posts = result.data
    print(f"대상 글 {len(posts)}개 조회 완료\n")

    success_count = 0
    for i, post in enumerate(posts, 1):
        print(f"[{i}/10] 재작성 중: {post['title'][:40]}...")

        rewritten = rewrite_post(client, post)
        if rewritten is None:
            print(f"  → 재작성 실패, 건너뜀")
            continue

        ok = update_post(supabase, post["id"], rewritten)
        if ok:
            success_count += 1
            print(f"  → 완료: {rewritten['title'][:50]}")
        else:
            print(f"  → UPDATE 실패")

        time.sleep(1.5)  # API rate limit 방지

    print(f"\n완료! {success_count}/{len(posts)}개 재작성 성공")


def rewrite_post(client, post):
    user_prompt = f"""카테고리: {post['category']}

원본 제목: {post['title']}
원본 설명: {post.get('description', '')}
원본 본문:
{post.get('content', '')}

위 글을 시스템 프롬프트 기준에 따라 전면 재작성하세요."""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                {"role": "user", "parts": [{"text": REWRITE_SYSTEM_PROMPT + "\n\n" + user_prompt}]}
            ]
        )
        text = response.text.strip()

        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        data = json.loads(text)

        # 필수 필드 확인
        if not all(k in data for k in ("title", "description", "content")):
            print(f"  경고: 필드 누락")
            return None

        # 대괄호 금지 확인
        for field in ("title", "description", "content"):
            if "[" in data[field] or "]" in data[field]:
                data[field] = data[field].replace("[", "").replace("]", "")

        return data

    except json.JSONDecodeError as e:
        print(f"  JSON 파싱 오류: {e}")
        return None
    except Exception as e:
        print(f"  Gemini 오류: {e}")
        return None


def update_post(supabase, post_id, rewritten):
    try:
        supabase.table("prompts").update({
            "title": rewritten["title"],
            "description": rewritten["description"],
            "content": rewritten["content"],
            "last_auto_update": TODAY,
            "updated_at": TODAY,
        }).eq("id", post_id).execute()
        return True
    except Exception as e:
        print(f"  UPDATE 오류: {e}")
        return False


if __name__ == "__main__":
    main()
