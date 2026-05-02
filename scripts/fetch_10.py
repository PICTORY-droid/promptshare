import urllib.request
import json
import os

SUPABASE_URL = "https://hkijkcoshdzzmaxiihzm.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWprY29zaDR6em1heGlpaHptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NjEwNCwiZXhwIjoyMDkwOTMyMTA0fQ.etZvtlgmIzC5etY7-QTD8ggTahQSUgzyxbpihMwDfZQ"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

def get_prompts_to_process(limit=10):
    url = f"{SUPABASE_URL}/rest/v1/prompts?select=id,title,content&order=created_at.asc&limit={limit}"
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"Error: {e}")
        return []

if __name__ == "__main__":
    prompts = get_prompts_to_process(10)
    print(json.dumps(prompts, ensure_ascii=False))
