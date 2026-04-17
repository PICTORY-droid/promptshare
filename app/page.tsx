function TypingAnimation() {
  const fullText = "// 최고의 AI 프롬프트를 공유하고 발견하세요"
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [glitchText, setGlitchText] = useState('')
  const [isGlitching, setIsGlitching] = useState(false)
  const glitchChars = '!@#$%^&*<>?/\\|[]{}~`ﾊﾐﾋｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂ'

  useEffect(() => {
    if (!isTyping) return
    if (displayedText.length < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1))
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setIsTyping(false)
    }
  }, [displayedText, isTyping, fullText])

  // 타이핑 완료 후 랜덤 글리치
  useEffect(() => {
    if (isTyping) return
    const triggerGlitch = () => {
      setIsGlitching(true)
      let count = 0
      const maxCount = 6
      const interval = setInterval(() => {
        setGlitchText(
          fullText.split('').map((char) => {
            if (char === ' ' || char === '/' || Math.random() > 0.3) return char
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          }).join('')
        )
        count++
        if (count >= maxCount) {
          clearInterval(interval)
          setGlitchText(fullText)
          setIsGlitching(false)
        }
      }, 60)
    }
    const schedule = () => {
      const delay = 2000 + Math.random() * 4000
      return setTimeout(() => {
        triggerGlitch()
        scheduleRef.current = schedule()
      }, delay)
    }
    const scheduleRef = { current: null as ReturnType<typeof setTimeout> | null }
    scheduleRef.current = schedule()
    return () => {
      if (scheduleRef.current) clearTimeout(scheduleRef.current)
    }
  }, [isTyping])

  const shown = isTyping ? displayedText : (isGlitching ? glitchText : fullText)

  return (
    <p className="text-sm font-mono" style={{ color: isGlitching ? '#8b949e' : '#484f58', minHeight: '1.5em', transition: 'color 0.1s' }}>
      {shown}
      {isTyping && <span style={{ color: '#58a6ff', animation: 'blink 1s infinite' }}>▍</span>}
    </p>
  )
}