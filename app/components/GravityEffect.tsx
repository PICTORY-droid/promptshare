'use client'

import { useEffect } from 'react'

export default function GravityEffect() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.prompt-card')
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect()
        const cardCenterX = rect.left + rect.width / 2
        const cardCenterY = rect.top + rect.height / 2
        const distX = e.clientX - cardCenterX
        const distY = e.clientY - cardCenterY
        const distance = Math.sqrt(distX * distX + distY * distY)
        const maxDist = 300
        if (distance < maxDist) {
          const force = (maxDist - distance) / maxDist
          const moveX = distX * force * 0.08
          const moveY = distY * force * 0.08
          const el = card as HTMLElement
          el.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.03})`
          el.style.transition = 'transform 0.1s ease'
          el.style.boxShadow = `0 0 ${force * 30}px rgba(88, 166, 255, ${force * 0.4})`
        } else {
          const el = card as HTMLElement
          el.style.transform = 'translate(0, 0) scale(1)'
          el.style.transition = 'transform 0.5s ease'
          el.style.boxShadow = 'none'
        }
      })
    }

    const handleMouseLeave = () => {
      const cards = document.querySelectorAll('.prompt-card')
      cards.forEach((card) => {
        const el = card as HTMLElement
        el.style.transform = 'translate(0, 0) scale(1)'
        el.style.transition = 'transform 0.5s ease'
        el.style.boxShadow = 'none'
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return null
}