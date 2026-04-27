"""
PromptLab 자동 재작성 스크립트
- last_auto_update IS NULL인 글을 created_at 오래된 순으로 10개 가져와 재작성
- Claude API로 GUIDELINE.md 기준 재작성 후 Supabase PATCH
- 실행: ANTHROPIC_API_KEY=sk-... python3 scripts/auto_rewrite.py
"""

import os, json, urllib.request, urllib.error, time

SUPABASE_URL = "https://hkijkcoshdzzmaxiihzm.supabase.co"
SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWprY29zaGR6em1heGlpaHptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NjEwNCwiZXhwIjoyMDkwOTMyMTA0fQ.etZvtlgmIzC5etY7-QTD8ggTahQSUgzyxbpihMwDfZQ"
ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
TODAY = "2026-04-27"

SB_HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

SYSTEM_PROMPT = """당신은 PromptLab 콘텐츠 에디터입니다. 아래 기준으로 프롬프트 글을 전면 재작성하십시오.

## 재작성 기준
1. 제목: 타겟(직종/세대/상황) + 상황 + 키워드 조합으로 강화. 특정 연도 절대 금지.
2. 설명(description): 2문장 핵심 요약. AI 티 나는 문장 금지.
3. 본문(content) 구조 — 아래 순서 그대로:
   한줄결론
   (한 문장. 독자가 바로 행동 판단 가능한 핵심.)

   실행 3단계
   (1단계~3단계. 각 단계에 변수 최소 1개 이상 포함.)

   체크리스트
   (☑ 형식. 5개 이상. 변수 포함.)

   프롬프트 예시
   (프롬프트 3~4개. 각각 역할 부여 + 변수 4개 이상.)

   이 정보가 필요한 분께 공유해보세요.

## 절대 규칙
- 모든 고정 수치/법령/세율/금리/임금 → {{변수명}} 처리. 예: {{최저임금}}, {{세율}}, {{금리}}
- 특정 연도 수치 하드코딩 금지 (예: "2024년", "9,860원" 금지)
- 대괄호 [ ] 절대 사용 금지
- AI 티 나는 문장 금지 ("~할 수 있습니다", "~를 통해 효율적으로" 등 진부한 표현 제거)
- author_id 컬럼 언급 금지
- 작성자명: PromptLab 고정

## 출력 형식
JSON만 출력. 다른 텍스트 없음.
{"title": "...", "description": "...", "content": "..."}
"""

def sb_get(path):
    req = urllib.request.Request(f"{SUPABASE_URL}{path}")
    for k, v in SB_HEADERS.items():
        req.add_header(k, v)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def sb_patch(table, record_id, payload):
    url = f"{SUPABASE_URL}/rest/v1/{table}?id=eq.{record_id}"
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, method="PATCH")
    for k, v in SB_HEADERS.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req) as r:
            return True
    except urllib.error.HTTPError as e:
        print(f"  PATCH 실패 {e.code}: {e.read().decode()[:200]}")
        return False

def claude_rewrite(post):
    user_msg = f"""아래 글을 재작성해주십시오.

카테고리: {post.get('category', '')}
현재 제목: {post['title']}
현재 설명: {post.get('description', '')}
현재 본문:
{post.get('content', '')}

JSON 형식으로만 응답하십시오: {{"title": "...", "description": "...", "content": "..."}}"""

    payload = json.dumps({
        "model": "claude-sonnet-4-6",
        "max_tokens": 4096,
        "system": SYSTEM_PROMPT,
        "messages": [{"role": "user", "content": user_msg}]
    }).encode()

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=payload,
        method="POST"
    )
    req.add_header("x-api-key", ANTHROPIC_KEY)
    req.add_header("anthropic-version", "2023-06-01")
    req.add_header("content-type", "application/json")

    try:
        with urllib.request.urlopen(req) as r:
            resp = json.loads(r.read())
            text = resp["content"][0]["text"].strip()
            # JSON 블록만 추출
            if "```" in text:
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
                text = text.strip()
            return json.loads(text)
    except urllib.error.HTTPError as e:
        print(f"  Claude API 오류 {e.code}: {e.read().decode()[:300]}")
        return None
    except json.JSONDecodeError as e:
        print(f"  JSON 파싱 실패: {e}")
        return None

def validate(rewritten):
    title = rewritten.get("title", "")
    content = rewritten.get("content", "")
    desc = rewritten.get("description", "")

    issues = []
    for yr in ["2023년", "2024년", "2025년", "2026년", "2027년"]:
        if yr in title or yr in content:
            issues.append(f"연도 하드코딩: {yr}")
    if "[" in content or "]" in content:
        issues.append("대괄호 사용")
    if "{{" not in content:
        issues.append("변수 없음 ({{변수}} 필수)")
    if "이 정보가 필요한 분께 공유해보세요" not in content:
        issues.append("CTA 누락")
    if "한줄결론" not in content:
        issues.append("한줄결론 섹션 누락")
    if "실행 3단계" not in content:
        issues.append("실행 3단계 섹션 누락")
    if "체크리스트" not in content:
        issues.append("체크리스트 섹션 누락")
    return issues

def main():
    if not ANTHROPIC_KEY:
        print("오류: ANTHROPIC_API_KEY 환경변수를 설정하십시오.")
        print("  export ANTHROPIC_API_KEY=sk-ant-...")
        return

    print("Supabase에서 재작성 대상 글 10개 조회 중...")
    posts = sb_get(
        "/rest/v1/prompts"
        "?last_auto_update=is.null"
        "&order=created_at.asc"
        "&limit=10"
        "&select=id,title,description,content,category"
    )
    print(f"  {len(posts)}개 조회됨\n")

    success, fail = 0, 0
    for i, post in enumerate(posts, 1):
        print(f"[{i:02d}/{len(posts)}] {post['title'][:60]}")
        print(f"       ID: {post['id']}")

        rewritten = claude_rewrite(post)
        if not rewritten:
            print("       → Claude 재작성 실패, 건너뜀\n")
            fail += 1
            continue

        issues = validate(rewritten)
        if issues:
            print(f"       ⚠ 검증 경고: {', '.join(issues)}")

        ok = sb_patch("prompts", post["id"], {
            "title":           rewritten["title"],
            "description":     rewritten["description"],
            "content":         rewritten["content"],
            "last_auto_update": TODAY,
        })

        if ok:
            print(f"       ✓ 완료: {rewritten['title'][:60]}\n")
            success += 1
        else:
            print(f"       ✗ Supabase PATCH 실패\n")
            fail += 1

        # API 레이트 리밋 방지
        if i < len(posts):
            time.sleep(1)

    print(f"\n완료: 성공 {success}개 / 실패 {fail}개")
    print(f"last_auto_update = {TODAY} 업데이트됨")

if __name__ == "__main__":
    main()
