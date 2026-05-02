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

PROGRESS_FILE = "upgrade_progress.json"

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"completed": [], "needs_review": []}

def save_progress(progress):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)

def get_prompts_to_process(limit=10):
    progress = load_progress()
    processed_ids = set(progress["completed"]) | set(progress["needs_review"])
    
    # Fetch prompts that haven't been processed
    # We might need to handle pagination if we want to skip already processed ones efficiently
    # But for small scale, we can just fetch and filter.
    url = f"{SUPABASE_URL}/rest/v1/prompts?select=id,title,content&order=created_at.asc"
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        with urllib.request.urlopen(req) as resp:
            all_prompts = json.loads(resp.read().decode("utf-8"))
            return [p for p in all_prompts if p["id"] not in processed_ids][:limit]
    except Exception as e:
        print(f"Error fetching prompts: {e}")
        return []

def update_prompt(prompt_id, upgraded_content):
    url = f"{SUPABASE_URL}/rest/v1/prompts?id=eq.{prompt_id}"
    payload = {
        "content": upgraded_content,
        "last_auto_update": "2026-05-01"
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="PATCH")
    for k, v in HEADERS.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req) as resp:
            return True
    except Exception as e:
        print(f"Error updating prompt {prompt_id}: {e}")
        return False

if __name__ == "__main__":
    prompts = get_prompts_to_process(10)
    for p in prompts:
        print(f"ID: {p['id']} | Title: {p['title']}")
        # The actual upgrading will be done by the agent calling this script or another logic.
