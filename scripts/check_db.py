import urllib.request
import json

SUPABASE_URL = "https://hkijkcoshdzzmaxiihzm.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWprY29zaGR6em1heGlpaHptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NjEwNCwiZXhwIjoyMDkwOTMyMTA0fQ.etZvtlgmIzC5etY7-QTD8ggTahQSUgzyxbpihMwDfZQ"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

def get_prompts_count():
    url = f"{SUPABASE_URL}/rest/v1/prompts?select=count"
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    req.add_header("Prefer", "count=exact")
    try:
        with urllib.request.urlopen(req) as resp:
            content_range = resp.getheader("Content-Range")
            return content_range.split("/")[-1] if content_range else "unknown"
    except Exception as e:
        return str(e)

def get_sample_prompts(limit=5):
    url = f"{SUPABASE_URL}/rest/v1/prompts?select=id,title,content&limit={limit}"
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return str(e)

print(f"Total prompts: {get_prompts_count()}")
samples = get_sample_prompts()
for s in samples:
    print(f"ID: {s['id']}")
    print(f"Title: {s['title']}")
    print(f"Content (first 100 chars): {s['content'][:100]}...")
    print("-" * 20)
