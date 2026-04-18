import os
import json
import random
from datetime import datetime, date
import google.generativeai as genai
from supabase import create_client

# ==========================================
# 설정
# ==========================================
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

# 작동 금지 날짜
BLOCKED_DATES = [
    date(2026, 4, 27), date(2026, 4, 28), date(2026, 4, 29),
    date(2026, 5, 6), date(2026, 5, 13), date(2026, 5, 20), date(2026, 5, 27),
]

# 카테고리
CATEGORIES = [
    "Coding", "Marketing", "Writing", "Education", "General", "Other",
    "Finance", "Legal", "Health", "Career", "Business", "Parenting",
    "Lifestyle", "Tech", "Real Estate", "Food", "Beauty", "Agriculture",
    "Social", "Psychology", "Environment", "Global"
]

# 직종 (제8차 한국표준직업분류 기준)
JOB_TYPES = [
    "경영·행정·사무직", "금융·보험직", "인문·사회과학 연구직",
    "자연·생명과학 연구직", "정보통신 연구개발직 및 공학기술직",
    "건설·채굴 연구개발직 및 공학기술직", "제조 연구개발직 및 공학기술직",
    "교육직", "법률직", "사회복지·종교직", "보건·의료직",
    "예술·디자인·방송직", "스포츠·레크리에이션직", "미용·예식 서비스직",
    "여행·숙박·오락 서비스직", "음식 서비스직", "경호·경비직",
    "돌봄 서비스직", "청소 및 기타 개인서비스직", "영업·판매직",
    "운전·운송직", "건설·채굴직", "기계 설치·정비·생산직",
    "금속·재료 설치·정비·생산직", "전기·전자 설치·정비·생산직",
    "정보통신 설치·정비직", "화학·환경 설치·정비·생산직",
    "섬유·의복 생산직", "식품 가공·생산직", "농림어업직",
    "제조 단순직", "관리직"
]

# 세대
GENERATIONS = ["Z세대(1997~2012)", "밀레니얼(1982~1996)", "X세대(1965~1981)", "베이비부머(1955~1964)", "시니어(1954이하)"]

# 지역
REGIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"]

# 사업체 규모
COMPANY_SIZES = ["1인 사업자", "소상공인(5인 미만)", "중소기업(300인 미만)", "중견기업", "대기업(300인 이상)", "공공기관"]

# 성별
GENDERS = ["남성", "여성", "공통"]

# 경력 단계
CAREER_STAGES = ["취업 준비생", "신입(1년 미만)", "주니어(1~3년)", "미드레벨(3~7년)", "시니어(7~15년)", "임원·관리자", "프리랜서", "창업자", "은퇴 준비"]

# ==========================================
# 메인 함수
# ==========================================
def main():
    # 오늘 날짜 확인
    today = date.today()
    print(f"오늘 날짜: {today}")

    # 작동 금지 날짜 체크
    if today in BLOCKED_DATES:
        print(f"오늘({today})은 작동 금지 날짜입니다. 종료합니다.")
        return

    # API 초기화
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # 기존 제목 키워드 조회 (토큰 절약을 위해 제목만 조회)
    print("기존 제목 조회 중...")
    result = supabase.table("prompts").select("title").execute()
    existing_titles = [row["title"] for row in result.data]
    existing_keywords = extract_keywords(existing_titles)
    print(f"기존 글 수: {len(existing_titles)}개")

    # 기존 작성자명 조회
    author_result = supabase.table("prompts").select("author_name").execute()
    existing_authors = list(set([row["author_name"] for row in author_result.data]))

    # 날짜 범위 계산 (과거~현재 균등 분포)
    used_dates_result = supabase.table("prompts").select("created_at").execute()
    used_dates = [row["created_at"][:10] for row in used_dates_result.data]

    # 50개 생성
    generated = 0
    attempts = 0
    max_attempts = 100

    while generated < 50 and attempts < max_attempts:
        attempts += 1

        # 랜덤 조합 선택
        combo = {
            "category": random.choice(CATEGORIES),
            "job_type": random.choice(JOB_TYPES),
            "generation": random.choice(GENERATIONS),
            "region": random.choice(REGIONS),
            "company_size": random.choice(COMPANY_SIZES),
            "gender": random.choice(GENDERS),
            "career_stage": random.choice(CAREER_STAGES),
        }

        # 날짜 선택 (과거~현재 균등 분포)
        created_at = pick_date(used_dates, today)

        # Gemini로 프롬프트 생성
        prompt_data = generate_prompt(model, combo, existing_keywords, existing_authors, created_at)

        if prompt_data is None:
            print(f"시도 {attempts}: 생성 실패, 재시도...")
            continue

        # 중복 체크
        if is_duplicate(prompt_data["title"], existing_titles):
            print(f"시도 {attempts}: 중복 제목 감지, 재시도...")
            continue

        # Supabase에 INSERT
        success = insert_prompt(supabase, prompt_data, created_at)

        if success:
            generated += 1
            existing_titles.append(prompt_data["title"])
            existing_authors.append(prompt_data["author_name"])
            used_dates.append(created_at[:10])
            print(f"✅ {generated}/50 생성 완료: {prompt_data['title']}")
        else:
            print(f"시도 {attempts}: INSERT 실패")

    print(f"\n완료! 총 {generated}개 생성됨")


# ==========================================
# 키워드 추출 (토큰 절약)
# ==========================================
def extract_keywords(titles):
    keywords = set()
    for title in titles:
        words = title.replace("—", " ").replace("-", " ").split()
        for word in words:
            if len(word) >= 2:
                keywords.add(word)
    return list(keywords)[:500]  # 최대 500개 키워드


# ==========================================
# 날짜 선택 (과거~현재 균등 분포)
# ==========================================
def pick_date(used_dates, today):
    from datetime import timedelta

    start_date = date(2024, 1, 1)
    all_dates = []
    d = start_date
    while d <= today:
        d_str = d.strftime("%Y-%m-%d")
        if d_str not in used_dates:
            all_dates.append(d_str)
        d += timedelta(days=1)

    if all_dates:
        chosen = random.choice(all_dates)
    else:
        # 빈 날짜 없으면 오늘 날짜에 시간 다르게
        chosen = today.strftime("%Y-%m-%d")

    hour = random.choice(["09:00:00", "11:00:00", "13:00:00", "15:00:00", "17:00:00"])
    return f"{chosen} {hour}+00"


# ==========================================
# Gemini로 프롬프트 생성
# ==========================================
def generate_prompt(model, combo, existing_keywords, existing_authors, created_at):
    date_str = created_at[:10]
    year = int(date_str[:4])
    month = int(date_str[5:7])

    system_prompt = f"""
당신은 한국 최고의 프롬프트 작성 전문가입니다.
아래 조건에 맞는 AI 프롬프트 1개를 JSON 형식으로 작성하세요.

## 작성 조건
- 카테고리: {combo['category']}
- 직종: {combo['job_type']}
- 세대: {combo['generation']}
- 지역: {combo['region']}
- 사업체 규모: {combo['company_size']}
- 성별: {combo['gender']}
- 경력 단계: {combo['career_stage']}
- 작성 기준 날짜: {year}년 {month}월 (이 시점의 실제 공시 데이터 기준으로 작성)

## 절대 금지
- 기존 키워드와 유사한 제목 금지: {', '.join(existing_keywords[:100])}
- 기존 작성자명 중복 금지: {', '.join(existing_authors[:50])}
- 환각 정보, 허위 수치, 존재하지 않는 법령 금지
- 특정 의학수치, 법률조항 임의 기재 금지
- 대괄호 사용 금지

## 작성 규칙
- 제목: 구체적이고 실용적인 제목 (예: "간호사 교대 스케줄 자동화 — Python으로 최적화")
- 설명: 2~3문장 핵심 요약
- 내용: 프롬프트 섹션 4개 이상, 각 섹션 150자 이상, 변수 {{{{변수명}}}} 4개 이상
- 작성자명: 한국어 5글자 이하 또는 영어 SNS 스타일 (예: 간호봇, ocr_dev)
- 좋아요율: 조회수의 3~6%
- 아쉬워요: 좋아요의 10~20%

## 날짜별 조회수 기준
- 2024년 초: views 600~900
- 2024년 중반: views 400~600
- 2024년 말: views 200~400
- 2025년 초: views 150~250
- 2025년 중반: views 80~150
- 2025년 말: views 40~90
- 2026년: views 10~40

## JSON 형식 (반드시 이 형식만 출력)
{{
  "title": "제목",
  "description": "설명",
  "content": "프롬프트 내용",
  "category": "{combo['category']}",
  "author_name": "작성자명",
  "views": 숫자,
  "likes": 숫자,
  "dislikes": 숫자
}}
"""

    try:
        response = model.generate_content(system_prompt)
        text = response.text.strip()

        # JSON 파싱
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        data = json.loads(text)
        return data

    except Exception as e:
        print(f"Gemini 오류: {e}")
        return None


# ==========================================
# 중복 체크
# ==========================================
def is_duplicate(new_title, existing_titles):
    new_words = set(new_title.replace("—", " ").replace("-", " ").split())
    for title in existing_titles:
        existing_words = set(title.replace("—", " ").replace("-", " ").split())
        overlap = new_words & existing_words
        if len(overlap) >= 3:
            return True
    return False


# ==========================================
# Supabase INSERT
# ==========================================
def insert_prompt(supabase, data, created_at):
    try:
        row = {
            "title": data["title"],
            "description": data.get("description", ""),
            "content": data["content"],
            "category": data["category"],
            "author_name": data["author_name"],
            "created_at": created_at,
            "updated_at": created_at,
            "password": "0520",
            "views": data.get("views", 50),
            "likes": data.get("likes", 3),
            "dislikes": data.get("dislikes", 0),
        }
        supabase.table("prompts").insert(row).execute()
        return True
    except Exception as e:
        print(f"INSERT 오류: {e}")
        return False


if __name__ == "__main__":
    main()