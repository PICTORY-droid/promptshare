'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface Activity {
  total_copied: number
  daily_copied: number
  abuse_warned: boolean
}

const GRADES = [
  { key: 'normal', label: '일반', emoji: '🪨', color: '#888780', border: '#555', bg: '#21262d', copies: 0, limit: '3회/일', desc: '가입 직후' },
  { key: 'bronze', label: '브론즈', emoji: '🥉', color: '#f0883e', border: '#bd561d', bg: '#2d1500', copies: 50, limit: '3회/일', desc: '50개 복사' },
  { key: 'silver', label: '실버', emoji: '🥈', color: '#b4b2a9', border: '#8b949e', bg: '#21262d', copies: 100, limit: '5회/일', desc: '100개 복사' },
  { key: 'gold', label: '골드', emoji: '🥇', color: '#d29922', border: '#9e6a03', bg: '#2d2200', copies: 200, limit: '10회/일', desc: '200개 복사' },
  { key: 'diamond', label: '다이아', emoji: '💎', color: '#bc8cff', border: '#8957e5', bg: '#2d1f3d', copies: 500, limit: '무제한', desc: '500개 복사' },
]

function getGrade(total: number) {
  if (total >= 500) return 'diamond'
  if (total >= 200) return 'gold'
  if (total >= 100) return 'silver'
  if (total >= 50) return 'bronze'
  return 'normal'
}

function getNextGrade(total: number) {
  if (total >= 500) return null
  if (total >= 200) return GRADES[4]
  if (total >= 100) return GRADES[3]
  if (total >= 50) return GRADES[2]
  return GRADES[1]
}

export default function PersonaPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase.from('user_activity').select('*').eq('user_id', session.user.id).single()
        setActivity(data)
      }
      setLoading(false)
    })
  }, [])

  const currentGrade = activity ? getGrade(activity.total_copied) : 'normal'
  const currentGradeInfo = GRADES.find(g => g.key === currentGrade)!
  const nextGrade = activity ? getNextGrade(activity.total_copied) : GRADES[1]
  const totalCopied = activity?.total_copied || 0
  const progress = nextGrade ? Math.min((totalCopied / nextGrade.copies) * 100, 100) : 100

  const inputStyle = { width: '100%', padding: '10px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', color: '#e6edf3', fontFamily: 'monospace', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const }

  return (
    <main className="min-h-screen" style={{ background: '#0d1117', color: '#e6edf3' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '20px 16px' }}>
        <button onClick={() => router.push('/')}
          style={{ background: 'none', border: 'none', color: '#58a6ff', fontFamily: 'monospace', fontSize: '13px', cursor: 'pointer', marginBottom: '24px', padding: 0 }}>
          ← cd ..
        </button>

        <h1 style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '22px', marginBottom: '6px' }}>
          <span style={{ color: '#8b949e' }}>// </span>
          <span style={{ color: '#bc8cff' }}>🤖 AI 페르소나 카드</span>
          <span className="blink" style={{ color: '#bc8cff' }}>_</span>
        </h1>
        <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#484f58', marginBottom: '28px' }}>
          // 나만의 AI 챗봇 설정을 만들고 링크로 공유하세요
        </p>

        {/* 어뷰징 경고 */}
        {activity?.abuse_warned && (
          <div style={{ background: '#2d1500', border: '1px solid #bd561d', borderLeft: '4px solid #f0883e', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontSize: '12px', color: '#f0883e', fontWeight: 700, marginBottom: '2px', fontFamily: 'monospace' }}>어뷰징 감지 경고</div>
              <div style={{ fontSize: '11px', color: '#bd561d', fontFamily: 'monospace' }}>비정상적인 복사 패턴이 감지됐습니다. 반복 시 등급 산정에서 제외될 수 있습니다.</div>
            </div>
          </div>
        )}

        {/* 무료 서비스 안내 */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ background: '#21262d', padding: '10px 16px', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#3fb950', fontWeight: 700, fontFamily: 'monospace' }}>// 등급제 안내</span>
            <span style={{ background: '#1a2d1a', color: '#3fb950', border: '1px solid #238636', borderRadius: '999px', padding: '1px 8px', fontSize: '10px', fontFamily: 'monospace' }}>완전 무료</span>
          </div>
          <div style={{ padding: '16px' }}>
            <p style={{ fontSize: '12px', color: '#8b949e', fontFamily: 'sans-serif', marginBottom: '14px', lineHeight: 1.8, wordBreak: 'keep-all' }}>
              프롬프트 복사할수록 등급 상승 →<br/><span style={{ color: '#bc8cff' }}>등급별</span> 페르소나 카드 생성 횟수 증가
            </p>

            {/* 등급 카드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
              <style>{`
                @keyframes grade-pulse-bronze { 0%,100% { box-shadow: 0 0 0 0 rgba(240,136,62,0); } 50% { box-shadow: 0 0 16px 6px rgba(240,136,62,0.7); } }
                @keyframes grade-pulse-silver { 0%,100% { box-shadow: 0 0 0 0 rgba(180,178,169,0); } 50% { box-shadow: 0 0 18px 6px rgba(180,178,169,0.8); } }
                @keyframes grade-pulse-gold { 0%,100% { box-shadow: 0 0 0 0 rgba(210,153,34,0); } 50% { box-shadow: 0 0 24px 8px rgba(210,153,34,0.9); } }
                @keyframes grade-dia-glow { 0%,100% { box-shadow: 0 0 10px 4px rgba(188,140,255,0.5); } 50% { box-shadow: 0 0 30px 12px rgba(188,140,255,0.9), 0 0 50px 20px rgba(88,166,255,0.4); } }
                @keyframes grade-scale { 0%,100% { transform: scale(1); } 50% { transform: scale(1.03); } }
              `}</style>
              {GRADES.map(g => (
                <div key={g.key} style={{
                  background: '#0d1117',
                  border: currentGrade === g.key ? '2px solid ' + g.border : '1px solid ' + g.border,
                  borderTop: '3px solid ' + g.color,
                  borderRadius: '8px', padding: '10px 6px', textAlign: 'center',
                  opacity: currentGrade === g.key ? 1 : 0.7,
                  animation: currentGrade === g.key ? (
                    g.key === 'bronze' ? 'grade-pulse-bronze 1.5s ease-in-out infinite, grade-scale 1.5s ease-in-out infinite' :
                    g.key === 'silver' ? 'grade-pulse-silver 1.2s ease-in-out infinite, grade-scale 1.2s ease-in-out infinite' :
                    g.key === 'gold' ? 'grade-pulse-gold 1s ease-in-out infinite, grade-scale 1s ease-in-out infinite' :
                    g.key === 'diamond' ? 'grade-dia-glow 0.8s ease-in-out infinite, grade-scale 0.8s ease-in-out infinite' :
                    'grade-scale 2s ease-in-out infinite'
                  ) : 'none',
                }}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>{g.emoji}</div>
                  <div style={{ fontSize: '11px', color: g.color, fontWeight: 700, marginBottom: '3px', fontFamily: 'monospace' }}>{g.label}</div>
                  <div style={{ fontSize: '9px', color: '#484f58', marginBottom: '6px', fontFamily: 'monospace' }}>{g.desc}</div>
                  <div style={{ background: g.bg, border: '1px solid ' + g.border, borderRadius: '4px', padding: '3px', fontSize: '10px', color: g.color, fontFamily: 'monospace' }}>{g.limit}</div>
                  {currentGrade === g.key && (
                    <div style={{ marginTop: '4px', fontSize: '9px', color: g.color, fontFamily: 'monospace' }}>▲ 현재</div>
                  )}
                </div>
              ))}
            </div>

            {/* 규칙 */}
            <div style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: '6px', padding: '10px 12px' }}>
              <p style={{ fontSize: '10px', color: '#484f58', fontFamily: 'monospace', lineHeight: 1.7, margin: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                  <span>✓ 동일 프롬프트 복사 No</span>
                  <span>✓ 하루 최대 <span style={{ color: '#8b949e' }}>30개</span>까지 인정</span>
                  <span>✓ 다른 프롬프트 복사만 인정</span>
                  <span>✓ 어뷰징 감지 시 경고 후 제외</span>
                </div>
              </p>
            </div>
          </div>
        </div>

        {/* 내 현재 등급 */}
        {user && (
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', color: '#3fb950', fontFamily: 'monospace', marginBottom: '12px' }}>// 내 현재 등급</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#21262d', border: '2px solid ' + currentGradeInfo.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {currentGradeInfo.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: currentGradeInfo.color, fontFamily: 'monospace' }}>{currentGradeInfo.label}</span>
                  <span style={{ fontSize: '11px', color: '#8b949e', fontFamily: 'monospace' }}>· 총 {totalCopied}개 복사</span>
                  <span style={{ fontSize: '11px', color: '#3fb950', fontFamily: 'monospace' }}>· 오늘 {activity?.daily_copied || 0}개</span>
                </div>
                {nextGrade ? (
                  <>
                    <div style={{ background: '#21262d', borderRadius: '999px', height: '6px', overflow: 'hidden', marginBottom: '4px' }}>
                      <div style={{ background: nextGrade.color, height: '6px', width: progress + '%', borderRadius: '999px', transition: 'width 0.5s ease' }}></div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#484f58', fontFamily: 'monospace' }}>
                      {nextGrade.emoji} {nextGrade.label}까지 <span style={{ color: nextGrade.color }}>{nextGrade.copies - totalCopied}개</span> 더 복사하면 됩니다
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '11px', color: '#bc8cff', fontFamily: 'monospace' }}>💎 최고 등급 달성!</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 페르소나 카드 생성 버튼 */}
        <button onClick={() => user ? router.push('/persona/create') : router.push('/')}
          style={{ width: '100%', padding: '14px', background: 'transparent', color: '#bc8cff', border: '2px solid #8957e5', borderRadius: '10px', fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '12px' }}>
          ⑂ 페르소나 카드 생성하기
        </button>

        {!user && (
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#484f58', fontFamily: 'monospace' }}>
            // 로그인하면 등급과 생성 횟수를 확인할 수 있습니다
          </p>
        )}
      </div>
    </main>
  )
}
