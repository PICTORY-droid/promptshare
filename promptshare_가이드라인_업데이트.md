# 📋 PromptShare 최종 가이드라인 전체 (업데이트 버전)

---

## 1. SQL 문법 규칙

- 텍스트 → $$...$$ 달러 쿼팅
- 날짜 → 작은따옴표 '2024-05-01 09:00:00+00'
- 숫자 → 따옴표 없음
- 비밀번호 → $$0520$$ 고정
- author_id 컬럼 절대 금지
- 대괄호 [ ] 절대 금지
- 섹션 구분 → 프롬프트 1: 형식 텍스트로만
- SQL 제출 전 달러 쿼팅 짝 수동 카운트 필수 ($$개수 반드시 짝수)

---

## 2. 날짜 규칙

- 범위: 2024-05-01 ~ 2024-08-31
- 모든 날짜 서로 달라야 함
- 기존 DB 날짜와 중복 금지
- 1번~10번 사용 날짜: 05-02, 05-04, 05-06, 05-08, 05-10, 05-12, 05-14, 05-16, 05-18, 05-20
- 11번~20번 사용 가능 날짜: 05-22부터 시작

---

## 3. 카테고리 균형 (50개당)

- Coding: 10개
- Marketing: 10개
- Writing: 6개
- Education: 8개
- General: 8개
- Other: 8개
- 합계: 50개

---

## 4. 타겟 균형 (50개당)

- 대기업/전문직: 17개
- 서민/자영업: 17개
- 중장년 45~65세: 16개
- 합계: 50개

---

## 5. 작성자 규칙

- 한국어 7 : 영어 3 비율
- 한국어 닉네임: 5글자 이하, 심플 직관적
  - 좋음: 수주달인, 입찰고수, 현장IT
  - 나쁨: 건설현장관리전문가, 안전제일주의자
- 영어 닉네임: 원어민 SNS 스타일
  - 좋음: site_pro, build_ken, sub_mkt
- 기존 전체 작성자명과 중복 절대 금지

---

## 6. 콘텐츠 품질 규칙

- 각 프롬프트 섹션 최소 150자 이상
- {{variable}} 변수 최소 4개 이상
- 프롬프트 섹션 최소 4개 구성
- 환각 절대 금지 — 존재하지 않는 수치/논문/인물/사례 금지
- 실존하는 기술/도구/방법론/법령만 사용
- 겉핥기 목차형 금지
- 탑티어 전문가 수준

---

## 7. 건설 분야 특화 규칙

- 법적 검토 가능 수준의 정확성 요구
- 확인된 수치/기준: 출처 법령명 + 고시번호 + 시행일 반드시 명시
- 미확인/변경 가능 수치: 확인된 자료의 날짜 명시 + 공식 링크 제공
- 참고 링크:
  - 국가법령정보센터: https://www.law.go.kr
  - 국가건설기준센터: https://www.kcsc.re.kr
  - 안전보건공단: https://www.kosha.or.kr
  - 하도급지킴이: https://www.subcon.or.kr
  - 나라장터: https://www.g2b.go.kr

---

## 8. 중복/유사 방지 규칙

- 10개 작성 전 기존 전체 제목과 1:1 대조 필수
- 동일 제목 금지
- 유사 주제 금지
- 같은 회차 내 시니어 주제 최대 3개
- 같은 회차 내 동일 카테고리 유사 주제 최대 1개

---

## 9. 핵심 작업 프로세스 (절대 준수)

- STEP 1: 10개 작성 전 가이드라인 전체 검토
- STEP 2: 10개 제목 초안 + 작성자명 초안 보고
- STEP 3: 기존 전체 제목/작성자명 1:1 대조 확인 보고
- STEP 4: 웹 검색으로 관련 법령/기준 확인
- STEP 5: 중복/유사 없음 확인 후 SQL 작성
- STEP 6: SQL 내부 자체 중복 검토
- STEP 7: 달러 쿼팅 짝 카운트
- STEP 8: 제출

---

## 10. 제출 전 체크리스트

- 제목 10개 DB 전체+이번 회차와 대조 완료 여부
- 작성자명 DB 전체+이번 회차와 대조 완료 여부
- SQL 내부 자체 중복 없음 확인
- 달러 쿼팅 짝수 확인
- 대괄호 없음 확인
- author_id 없음 확인
- 법령 출처 명시 확인
- 미확인 수치 링크 기재 확인
- 타겟 균형 확인
- 섹션 150자 이상 확인

---

## 11. 절대 금지 14가지

1. author_id 컬럼 사용
2. 대괄호 [ ] 사용
3. 작성자명 중복
4. 날짜 중복
5. 환각 정보 사용
6. 겉핥기 목차형 내용
7. 긴 조합 한국어 닉네임
8. 존재하지 않는 도구/기술/법령
9. 유사 주제 중복
10. 달러 쿼팅 미완성
11. 가이드라인 검토 없이 10개 진행
12. 의학수치/법률조항/특정연구 임의 인용
13. SQL 자체 중복 검토 없이 제출
14. 미확인 수치 링크 없이 기재

---

## 12. 🆕 조회수·좋아요·아쉬워요 데이터 조작 규칙 (신규 추가)

### 배경
PromptShare는 샘플 데이터로 운영되므로, 신뢰도 있는 커뮤니티처럼 보이기 위해
조회수(views), 좋아요(likes), 아쉬워요(dislikes) 수치를 날짜 기반으로 현실적으로 설정해야 한다.

### 핵심 원칙
- **최근 글일수록 조회수/좋아요가 적어야 한다** (자연스러운 커뮤니티 성장 곡선)
- **좋아요율은 조회수의 3~6% 수준**이 현실적 (SNS 평균 참고)
- **최솟값이 딱 떨어지면 인위적으로 티남** → 랜덤 범위 필수
- **좋아요율이 10% 이상이면 의심받음** → 절대 초과 금지

### 날짜별 현실적 수치 기준표

| 기간 | 조회수 범위 | 좋아요 범위 | 비고 |
|------|-----------|-----------|------|
| 2024년 1~3월 (가장 오래된 글) | 550~950 | 22~57 | 초기 커뮤니티 |
| 2024년 4~6월 | 400~700 | 16~42 | 성장기 |
| 2024년 7~9월 | 280~480 | 11~29 | |
| 2024년 10~12월 | 180~330 | 7~20 | |
| 2025년 1~3월 | 120~270 | 5~16 | |
| 2025년 4~6월 | 80~220 | 3~13 | |
| 2025년 7~9월 | 55~115 | 2~7 | |
| 2025년 10~12월 | 38~83 | 2~5 | |
| 2026년 1월 | 28~63 | 1~4 | |
| 2026년 2월 | 22~50 | 1~3 | |
| 2026년 3월 | 16~38 | 1~2 | |
| 2026년 4월~ (최근) | 10~28 | 1~2 | 최소 1 보장 |

### 조회수/좋아요 일괄 재설정 SQL (기준 쿼리)

새 글을 대량 등록한 후, 아래 SQL을 Supabase SQL Editor에서 실행하면
전체 글의 수치가 날짜 기반으로 자동 재설정된다.

```sql
UPDATE prompts
SET
  views = CASE
    WHEN created_at < '2024-02-01' THEN (600 + floor(random() * 400))::int
    WHEN created_at < '2024-04-01' THEN (550 + floor(random() * 350))::int
    WHEN created_at < '2024-07-01' THEN (400 + floor(random() * 300))::int
    WHEN created_at < '2024-10-01' THEN (280 + floor(random() * 200))::int
    WHEN created_at < '2025-01-01' THEN (180 + floor(random() * 150))::int
    WHEN created_at < '2025-04-01' THEN (120 + floor(random() * 100))::int
    WHEN created_at < '2025-07-01' THEN (80 + floor(random() * 80))::int
    WHEN created_at < '2025-10-01' THEN (55 + floor(random() * 60))::int
    WHEN created_at < '2026-01-01' THEN (38 + floor(random() * 45))::int
    WHEN created_at < '2026-02-01' THEN (28 + floor(random() * 35))::int
    WHEN created_at < '2026-03-01' THEN (22 + floor(random() * 28))::int
    WHEN created_at < '2026-04-01' THEN (16 + floor(random() * 22))::int
    ELSE (10 + floor(random() * 18))::int
  END,
  likes = CASE
    WHEN created_at < '2024-02-01' THEN greatest(1, floor((600 + floor(random() * 400)) * (0.04 + random() * 0.03)))::int
    WHEN created_at < '2024-04-01' THEN greatest(1, floor((550 + floor(random() * 350)) * (0.04 + random() * 0.03)))::int
    WHEN created_at < '2024-07-01' THEN greatest(1, floor((400 + floor(random() * 300)) * (0.04 + random() * 0.03)))::int
    WHEN created_at < '2024-10-01' THEN greatest(1, floor((280 + floor(random() * 200)) * (0.04 + random() * 0.03)))::int
    WHEN created_at < '2025-01-01' THEN greatest(1, floor((180 + floor(random() * 150)) * (0.04 + random() * 0.03)))::int
    WHEN created_at < '2025-04-01' THEN greatest(1, floor((120 + floor(random() * 100)) * (0.04 + random() * 0.03)))::int
    WHEN created_at < '2025-07-01' THEN greatest(1, floor((80 + floor(random() * 80)) * (0.04 + random() * 0.03)))::int
    WHEN created_at < '2025-10-01' THEN greatest(1, floor((55 + floor(random() * 60)) * (0.04 + random() * 0.03)))::int
    WHEN created_at < '2026-01-01' THEN greatest(1, floor((38 + floor(random() * 45)) * (0.04 + random() * 0.03)))::int
    WHEN created_at < '2026-02-01' THEN greatest(1, floor((28 + floor(random() * 35)) * (0.04 + random() * 0.03)))::int
    WHEN created_at < '2026-03-01' THEN greatest(1, floor((22 + floor(random() * 28)) * (0.04 + random() * 0.03)))::int
    WHEN created_at < '2026-04-01' THEN greatest(1, floor((16 + floor(random() * 22)) * (0.04 + random() * 0.03)))::int
    ELSE greatest(1, floor((10 + floor(random() * 18)) * (0.04 + random() * 0.03)))::int
  END;
```

> ⚠️ 경고창 "Query uses update without a where clause" → 의도된 전체 업데이트이므로 "Run this query" 클릭

### 아쉬워요(dislikes) 컬럼 추가 SQL

아쉬워요 기능을 추가할 때 아래 SQL 먼저 실행:

```sql
ALTER TABLE prompts
ADD COLUMN dislikes INTEGER DEFAULT 0 NOT NULL;
```

### 아쉬워요 수치 기준
- 아쉬워요는 좋아요의 10~30% 수준이 자연스러움
- 예: 좋아요 20개 → 아쉬워요 2~6개
- 아쉬워요가 좋아요보다 많으면 콘텐츠 신뢰도 하락 → 절대 금지

### 아쉬워요 일괄 설정 SQL (dislikes 컬럼 추가 후 실행)

```sql
UPDATE prompts
SET dislikes = greatest(0, floor(likes * (0.10 + random() * 0.20)))::int;
```

### 수치 검증 쿼리 (작업 후 반드시 실행)

```sql
SELECT 
  TO_CHAR(created_at, 'YYYY-MM') as 월,
  COUNT(*) as 글수,
  ROUND(AVG(views)) as 평균조회수,
  ROUND(AVG(likes)) as 평균좋아요,
  ROUND(AVG(dislikes)) as 평균아쉬워요
FROM prompts
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY 월 ASC;
```

### 이상 징후 체크 기준

| 항목 | 정상 범위 | 이상 신호 |
|------|----------|----------|
| 좋아요율 (likes/views) | 3~6% | 10% 이상이면 의심 |
| 아쉬워요율 (dislikes/likes) | 10~30% | 50% 이상이면 의심 |
| 최근 글 조회수 | 10~28 | 100 이상이면 의심 |
| 오래된 글 조회수 | 550~950 | 5000 이상이면 의심 |
| 좋아요 최솟값 | 1 이상 | 0이면 재설정 필요 |

### 작업 주기
- 샘플 글 100개 신규 등록 후 → 반드시 수치 재설정 SQL 실행
- 날짜 범위가 늘어날 때마다 (예: 2026년 5월 이후 글 추가 시) → CASE 구문에 새 구간 추가
- 분기마다 검증 쿼리 실행하여 이상 징후 체크
