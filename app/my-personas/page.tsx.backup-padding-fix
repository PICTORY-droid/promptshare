'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

const TONE_LABEL: Record<string, string> = {
  friendly: '😊 친근하게',
  professional: '🎯 전문적으로',
  concise: '⚡ 간결하게',
  funny: '😄 유쾌하게',
}

export default function MyPersonasPage() {
  const router = useRouter()
  const [personas, setPersonas] = useState<any[]>([])
  const [message, setMessage] = useState('불러오는 중...')
  const [page, setPage] = useState(1)
  const pageSize = 6

  useEffect(() => {
    const cached = localStorage.getItem('my_personas_cache')
    if (cached) {
      try {
        setPersonas(JSON.parse(cached))
        setMessage('')
      } catch {}
    }

    const fetchPersonas = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setMessage('로그인 후 이용할 수 있습니다')
          return
        }

        const { data, error } = await supabase
          .from('persona_cards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          setMessage('페르소나를 불러오지 못했습니다')
          return
        }

        setPersonas(data || [])
        localStorage.setItem('my_personas_cache', JSON.stringify(data || []))

        if (!data || data.length === 0) {
          setMessage('아직 만든 페르소나가 없습니다')
        } else {
          setMessage('')
        }
      } catch {
        setMessage('페르소나를 불러오지 못했습니다')
      }
    }

    fetchPersonas()
  }, [])

  const formatDate = (dateText: string) => {
    if (!dateText) return '날짜 없음'
    const date = new Date(dateText)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const totalPages = Math.max(1, Math.ceil(personas.length / pageSize))
  const pagedPersonas = personas.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px', fontFamily: 'monospace' }}>
        내 페르소나
      </h2>

      {personas.length === 0 && (
        <div style={{ color: '#aaa', fontFamily: 'monospace' }}>{message}</div>
      )}

      {personas.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {pagedPersonas.map((p, i) => (
            <div
              key={p.id || i}
              onClick={() => {
                if (p.slug) router.push(`/persona/${p.slug}`)
              }}
              style={{
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: '0.2s',
                minHeight: '170px'
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = '#8957e5'
                e.currentTarget.style.boxShadow = '0 0 22px rgba(137, 87, 229, 0.28)'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = '#30363d'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                background: '#21262d',
                padding: '8px 14px',
                borderBottom: '1px solid #30363d',
                display: 'flex',
                gap: '6px',
                alignItems: 'center'
              }}>
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff5f57' }}></div>
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#28c840' }}></div>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  color: '#8b949e',
                  marginLeft: '6px'
                }}>
                  persona-card.md
                </span>
              </div>

              <div style={{ padding: '18px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '13px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: '#2d1f3d',
                    border: '2px solid #8957e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    boxShadow: '0 0 16px rgba(137, 87, 229, 0.25)',
                    flexShrink: 0
                  }}>
                    🤖
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      color: '#e6edf3',
                      fontWeight: 700,
                      fontSize: '16px',
                      fontFamily: 'monospace',
                      marginBottom: '5px'
                    }}>
                      {p.name || '이름 없음'}
                    </div>

                    <span style={{
                      background: '#2d1f3d',
                      color: '#bc8cff',
                      border: '1px solid #8957e5',
                      borderRadius: '999px',
                      padding: '2px 9px',
                      fontFamily: 'monospace',
                      fontSize: '10px'
                    }}>
                      {TONE_LABEL[p.tone] || p.tone || '톤 없음'}
                    </span>
                  </div>
                </div>

                <div style={{
                  color: '#c9d1d9',
                  fontSize: '12px',
                  lineHeight: '1.65',
                  marginBottom: '14px'
                }}>
                  {p.role ? (p.role.length > 85 ? p.role.substring(0, 85) + '...' : p.role) : '역할 없음'}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #21262d',
                  paddingTop: '10px',
                  color: '#6e7681',
                  fontSize: '10px',
                  fontFamily: 'monospace'
                }}>
                  <span style={{ color: '#484f58' }}>created</span>
                  <span>{formatDate(p.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {personas.length > pageSize && (
        <div style={{
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'monospace'
        }}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              padding: '9px 13px',
              background: page === 1 ? '#0d1117' : '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              color: page === 1 ? '#484f58' : '#58a6ff',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontFamily: 'monospace'
            }}
          >
            ← prev
          </button>

          <div style={{
            padding: '9px 14px',
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '8px',
            color: '#bc8cff',
            fontSize: '12px'
          }}>
            page {page} / {totalPages}
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{
              padding: '9px 13px',
              background: page === totalPages ? '#0d1117' : '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              color: page === totalPages ? '#484f58' : '#58a6ff',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              fontFamily: 'monospace'
            }}
          >
            next →
          </button>
        </div>
      )}
    </div>
  )
}
