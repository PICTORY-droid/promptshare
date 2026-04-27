"""
Supabase에서 last_auto_update IS NULL 글 10개 조회 후 출력
실행: python3 scripts/fetch_posts.py
출력된 JSON을 Claude에 붙여넣으면 재작성 가능
"""
import urllib.request, json

SUPABASE_URL = "https://hkijkcoshdzzmaxiihzm.supabase.co"
SERVICE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWprY29zaGR6em1heGlpaHptIiwicm9sZSI6"
    "InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NjEwNCwiZXhwIjoyMDkwOTMyMTA0fQ."
    "etZvtlgmIzC5etY7-QTD8ggTahQSUgzyxbpihMwDfZQ"
)

url = (
    f"{SUPABASE_URL}/rest/v1/prompts"
    "?select=id,title,description,content,category"
    "&last_auto_update=is.null&order=created_at.asc&limit=10"
)
req = urllib.request.Request(url)
req.add_header("apikey", SERVICE_KEY)
req.add_header("Authorization", f"Bearer {SERVICE_KEY}")
req.add_header("Content-Type", "application/json")

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read())
    print(json.dumps(data, ensure_ascii=False, indent=2))
