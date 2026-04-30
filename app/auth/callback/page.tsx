'use client'

import { useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code')
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => {
        router.replace('/')
      }).catch(() => {
        router.replace('/')
      })
    } else {
      // fragment(#access_token=...) 방식은 Supabase SDK가 detectSessionInUrl로 자동 처리
      router.replace('/')
    }
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
      <div className="font-mono text-lg" style={{ color: '#58a6ff' }}>
        <span style={{ color: '#3fb950' }}>$</span> authenticating<span className="blink">_</span>
      </div>
    </main>
  )
}
