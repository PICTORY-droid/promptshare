'use client'
import { SWRConfig } from 'swr'

function localStorageProvider() {
  if (typeof window === 'undefined') return new Map()
  const map = new Map<string, unknown>(
    JSON.parse(localStorage.getItem('pl-swr-cache') || '[]')
  )
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('pl-swr-cache', JSON.stringify(Array.from(map.entries())))
  })
  return map
}

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ provider: localStorageProvider, revalidateOnFocus: false }}>
      {children}
    </SWRConfig>
  )
}
