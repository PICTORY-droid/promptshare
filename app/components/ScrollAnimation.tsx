'use client'

import { useEffect, useRef, ReactNode } from 'react'

export default function ScrollAnimation({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const items = ref.current?.querySelectorAll('.scroll-item')
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return <div ref={ref}>{children}</div>
}
