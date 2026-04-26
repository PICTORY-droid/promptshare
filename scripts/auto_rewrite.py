#!/usr/bin/env python3
"""
PromptLab 자동 재작성 스크립트
- last_auto_update IS NULL인 글을 created_at 오래된 순으로 10개 가져와 전면 재작성
- Claude API 사용 (claude-sonnet-4-6)
- 실행: python3 scripts/auto_rewrite.py
- 환경변수: ANTHROPIC_API_KEY 필요
"""

import urllib.request
import urllib.error
import json
import os
import sys
import time
from datetime import date

SUPABASE_URL = "https://hkijkcoshdzzmaxiihzm.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWprY29zaGR6em1heGlpaHptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NjEwNCwiZXhwIjoyMDkwOTMyMTA0fQ.etZvtlgmIzC5etY7-QTD8ggTahQSUgzyxbpihMwDfZQ"
TODAY = str(date.today())
MODEL = "claude-sonnet-4-6"

SUPABASE_HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

SYSTEM_PROMPT = """당신은 PromptLab의 수석 콘텐츠 에디터입니다. 주어진 글을 아래 기준으로 전면 재작성하세요.

## 재작성 기준

### 제목
- 타겟(직종/세대/상황) + 키워드(방법/이유/체크리스트/비교/실수/현실/전략 중 1개) 조합
- 특정 연도 절대 금지 (2024년, 2025년 등)
- 대괄호 [ ] 절대 금지
- 예: "50대 생산직이 퇴직 전 반드시 확인할 7가지 현실 체크리스트"

### 설명 (description)
- 정확히 2문장으로 핵심 요약
- 독자가 읽어야 할 이유를 첫 문장에

### 본문 (content) — 반드시 이 순서로
1. 한줄결론: 핵심 주장 1문장 (제목 아래 바로)
2. 실행 3단계: 구체적이고 즉시 실행 가능한 단계별 안내
3. 체크리스트: ☑ 기호로 5~7개 항목
4. 프롬프트 예시: 실제 쓸 수 있는 프롬프트 3~4개 (각각 역할 부여 + 변수 포함)
5. CTA: 마지막 줄은 반드시 "이 정보가 필요한 분께 공유해보세요."

### 변수 처리 규칙
- 모든 고정 수치, 법령, 세율, 임금, 금리 → {{변수명}} 형식으로 변환
- 예: "최저임금 9,860원" → "현재 최저임금 {{최저임금}}원"
- 예: "부가세 10%" → "현행 부가세율 {{세율}}%"
- 연도 수치도 변수 처리: "2025년 기준" → "현행 기준"으로 제거하거나 {{기준년도}}

### 절대 금지
- AI 티 나는 문장 (예: "이 글에서는", "살펴보겠습니다", "중요합니다", "필요합니다")
- 대괄호 [ ]
- 특정 연도 하드코딩
- 의학수치·법률조항 임의 인용 (공식 출처 URL 병기 필수)
- 겉핥기 목차형 내용

### 출력 형식
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만:
{
  "title": "재작성된 제목",
  "description": "재작성된 설명",
  "content": "재작성된 본문"
}"""

def supabase_request(method, path, data=None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=SUPABASE_HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw.strip() else {}
    except urllib.error.HTTPError as e:
        msg = e.read().decode("utf-8")
        print(f"  Supabase {method} 오류 {e.code}: {msg[:200]}")
        raise

def fetch_posts():
    path = "prompts?last_auto_update=is.null&order=created_at.asc&limit=10&select=id,title,description,content,category"
    posts = supabase_request("GET", path)
    return posts

def call_claude(api_key, post):
    user_msg = f"""아래 글을 전면 재작성해주세요.

현재 제목: {post['title']}
현재 설명: {post.get('description', '')}
현재 본문:
{post.get('content', '')}

카테고리: {post.get('category', '')}"""

    payload = {
        "model": MODEL,
        "max_tokens": 4096,
        "system": SYSTEM_PROMPT,
        "messages": [{"role": "user", "content": user_msg}],
    }

    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=body,
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    text = result["content"][0]["text"].strip()
    # JSON 블록만 추출 (```json ... ``` 감싸진 경우 처리)
    if text.startswith("```"):
        lines = text.split("\n")
        text = "\n".join(lines[1:-1]) if lines[-1] == "```" else "\n".join(lines[1:])
    return json.loads(text)

def update_post(post_id, rewritten):
    path = f"prompts?id=eq.{post_id}"
    supabase_request("PATCH", path, {
        "title": rewritten["title"],
        "description": rewritten["description"],
        "content": rewritten["content"],
        "last_auto_update": TODAY,
        "updated_at": f"{TODAY}T00:00:00+00:00",
    })

def validate(rewritten, post_id):
    title = rewritten.get("title", "")
    content = rewritten.get("content", "")
    issues = []
    if "[" in title or "]" in title:
        issues.append("제목에 대괄호 포함")
    for year in ["2023년", "2024년", "2025년", "2026년"]:
        if year in title:
            issues.append(f"제목에 연도 {year} 포함")
    if "이 정보가 필요한 분께 공유해보세요" not in content:
        issues.append("CTA 누락")
    if "{{" not in content:
        issues.append("변수 처리 없음")
    if issues:
        print(f"  경고 [{post_id[:8]}]: {', '.join(issues)}")
    return len(issues) == 0

def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("오류: ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.")
        print("실행 방법: ANTHROPIC_API_KEY=sk-ant-... python3 scripts/auto_rewrite.py")
        sys.exit(1)

    print(f"PromptLab 자동 재작성 시작 — {TODAY}")
    print("=" * 60)

    print("Supabase에서 글 가져오는 중...")
    try:
        posts = fetch_posts()
    except Exception as e:
        print(f"Supabase 연결 실패: {e}")
        sys.exit(1)

    if not posts:
        print("재작성할 글이 없습니다. (last_auto_update IS NULL 조건)")
        return

    print(f"대상 글 {len(posts)}개 확인\n")

    success = 0
    fail = 0

    for i, post in enumerate(posts, 1):
        pid = post["id"]
        print(f"[{i:02d}/{len(posts)}] {post['title'][:50]}...")
        print(f"       ID: {pid[:8]}... / 카테고리: {post.get('category', '-')}")

        try:
            rewritten = call_claude(api_key, post)
            valid = validate(rewritten, pid)

            print(f"       → {rewritten['title'][:60]}")

            update_post(pid, rewritten)
            status = "완료" if valid else "완료(경고)"
            print(f"       [{status}] Supabase 업데이트 성공\n")
            success += 1

        except json.JSONDecodeError as e:
            print(f"       [실패] Claude 응답 파싱 오류: {e}\n")
            fail += 1
        except Exception as e:
            print(f"       [실패] {e}\n")
            fail += 1

        if i < len(posts):
            time.sleep(1)  # API 속도 제한 대비

    print("=" * 60)
    print(f"완료: {success}개 성공 / {fail}개 실패")
    print(f"last_auto_update → {TODAY} 으로 업데이트됨")

if __name__ == "__main__":
    main()
