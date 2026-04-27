"""
PromptLab 일일 재작성 자동화 스크립트
--------------------------------------
실행 전 준비:
  pip install anthropic
  export ANTHROPIC_API_KEY=sk-ant-...

실행:
  python3 scripts/rewrite_prompts_auto.py

동작:
  1. Supabase에서 last_auto_update IS NULL 글을 created_at 오래된 순으로 10개 조회
  2. Claude API로 가이드라인 기준 전면 재작성
  3. Supabase PATCH로 업데이트 + last_auto_update = 오늘 날짜
"""

import os
import json
import urllib.request
import urllib.error
from datetime import date

# ─── 설정 ───────────────────────────────────────────────────────────────────
SUPABASE_URL = "https://hkijkcoshdzzmaxiihzm.supabase.co"
SERVICE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWprY29zaGR6em1heGlpaHptIiwicm9sZSI6"
    "InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NjEwNCwiZXhwIjoyMDkwOTMyMTA0fQ."
    "etZvtlgmIzC5etY7-QTD8ggTahQSUgzyxbpihMwDfZQ"
)
TODAY = str(date.today())   # 예: "2026-04-27"

SUPABASE_HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

SYSTEM_PROMPT = """\
당신은 PromptLab 콘텐츠 에디터입니다. 아래 글을 다음 기준으로 전면 재작성하십시오.

# 절대 규칙
- 대괄호 [ ] 절대 사용 금지
- 특정 연도·수치 하드코딩 금지 (예: "2024년 최저임금 9,860원" → {{최저임금}}원으로 변수 처리)
- AI 티 나는 문장 금지 ("~를 통해", "~을 바탕으로", "~을 통한 접근" 등 기계적 표현 제거)
- author_id 컬럼 절대 사용 금지

# 출력 형식 (JSON만 출력, 다른 텍스트 없음)
{
  "title": "재작성된 제목",
  "description": "재작성된 설명",
  "content": "재작성된 본문"
}

# 제목 기준
- 타겟(직종/세대/상황) + 상황 + 키워드 조합
- 방법/이유/체크리스트/비교/실수/현실/전략 중 1개 포함
- 특정 연도 제목에 절대 포함 금지
- 좋은 예: "소상공인이 절세 신고서 작성할 때 반드시 피해야 할 5가지 실수"
- 나쁜 예: "2024년 세금 절약 방법"

# 설명 기준
- 2문장으로 핵심 요약
- 첫 문장: 문제 또는 핵심 상황
- 둘째 문장: 이 글로 얻는 것

# 본문 구조 (이 순서대로, 각 섹션 150자 이상)
한줄결론
(한 문장으로 핵심 결론)

실행 3단계
1단계: ...
2단계: ...
3단계: ...

체크리스트
☑ ...
☑ ...
☑ ...
☑ ...
☑ ...

프롬프트 예시

프롬프트 1: (소제목)
당신은 (역할)입니다. {{변수1}}, {{변수2}} 기준으로 ... (구체적 지시)

프롬프트 2: (소제목)
당신은 (역할)입니다. {{변수3}}, {{변수4}} 기준으로 ...

프롬프트 3: (소제목)
당신은 (역할)입니다. {{변수5}} 기준으로 ...

이 정보가 필요한 분께 공유해보세요.

# 변수 처리 규칙
- 법령·세율·금리·임금·정책 수치는 반드시 {{변수명}} 형식으로
- 사용자 입력값도 {{변수명}} 형식 (예: {{업종}}, {{직원수}}, {{월소득}})
- 변수 4개 이상 포함 필수
"""

REWRITE_TEMPLATE = """\
아래 글을 가이드라인 기준으로 전면 재작성하십시오.

카테고리: {category}

원본 제목: {title}
원본 설명: {description}
원본 본문:
{content}

JSON만 출력하십시오.
"""


# ─── Supabase 유틸 ────────────────────────────────────────────────────────────

def supabase_get(path: str) -> list:
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    req = urllib.request.Request(url)
    for k, v in SUPABASE_HEADERS.items():
        req.add_header(k, v)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())


def supabase_patch(table: str, row_id: str, payload: dict) -> bool:
    url = f"{SUPABASE_URL}/rest/v1/{table}?id=eq.{row_id}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="PATCH")
    for k, v in SUPABASE_HEADERS.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req) as resp:
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:300]
        print(f"  PATCH 실패 {e.code}: {body}")
        return False


# ─── Claude API 유틸 ──────────────────────────────────────────────────────────

def rewrite_with_claude(post: dict) -> dict | None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise EnvironmentError("ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.")

    user_msg = REWRITE_TEMPLATE.format(
        category=post.get("category", "General"),
        title=post.get("title", ""),
        description=post.get("description", ""),
        content=post.get("content", ""),
    )

    payload = {
        "model": "claude-sonnet-4-6",
        "max_tokens": 4096,
        "system": SYSTEM_PROMPT,
        "messages": [{"role": "user", "content": user_msg}],
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=data,
        method="POST",
    )
    req.add_header("x-api-key", api_key)
    req.add_header("anthropic-version", "2023-06-01")
    req.add_header("content-type", "application/json")

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode())
            text = result["content"][0]["text"].strip()
            # JSON 블록 추출
            if "```" in text:
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
                text = text.strip()
            return json.loads(text)
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:300]
        print(f"  Claude API 오류 {e.code}: {body}")
        return None
    except json.JSONDecodeError as e:
        print(f"  JSON 파싱 실패: {e}")
        return None


# ─── 메인 ────────────────────────────────────────────────────────────────────

def main():
    print(f"PromptLab 일일 재작성 시작 — {TODAY}\n")

    # 1. 데이터 조회
    print("Supabase에서 글 조회 중...")
    try:
        posts = supabase_get(
            "prompts?select=id,title,description,content,category"
            "&last_auto_update=is.null&order=created_at.asc&limit=10"
        )
    except Exception as e:
        print(f"조회 실패: {e}")
        return

    if not posts:
        print("재작성할 글이 없습니다. (last_auto_update IS NULL 없음)")
        return

    print(f"{len(posts)}개 글 조회 완료\n")

    # 2. 재작성 + 업데이트
    success = 0
    for i, post in enumerate(posts, 1):
        pid = post["id"]
        old_title = post.get("title", "")
        print(f"[{i:02d}/{len(posts)}] {old_title[:60]}")

        rewritten = rewrite_with_claude(post)
        if not rewritten:
            print("  → 재작성 실패, 건너뜀\n")
            continue

        new_title = rewritten.get("title", old_title)
        new_desc = rewritten.get("description", post.get("description", ""))
        new_content = rewritten.get("content", post.get("content", ""))

        # 기본 검증
        if "이 정보가 필요한 분께 공유해보세요" not in new_content:
            new_content += "\n\n이 정보가 필요한 분께 공유해보세요."

        ok = supabase_patch("prompts", pid, {
            "title": new_title,
            "description": new_desc,
            "content": new_content,
            "last_auto_update": TODAY,
        })

        if ok:
            success += 1
            print(f"  → {new_title[:70]}")
            print(f"  ✓ 업데이트 완료\n")
        else:
            print(f"  ✗ 업데이트 실패\n")

    print(f"\n완료: {success}/{len(posts)}개 재작성 성공")
    print(f"last_auto_update = {TODAY} 설정됨")


if __name__ == "__main__":
    main()
