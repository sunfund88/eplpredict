// components/CountdownTimer.tsx
'use client'
import { useState, useEffect } from 'react'

export default function CountdownTimer({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const checkInitialStatus = () => {
      const now = new Date().getTime()
      const target = new Date(deadline).getTime()
      if (target - now > 0) {
        setIsExpired(false) // กลับมาเป็นสีเขียวถ้ายังไม่หมดเวลา
      } else {
        setIsExpired(true)
        setTimeLeft("DEADLINE PASSED")
      }
    }
    checkInitialStatus()
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(deadline).getTime()
      const distance = target - now

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft("DEADLINE PASSED")
        setIsExpired(true)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  return (
    <div className={`text-center p-3 rounded-xl border ${isExpired ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-lime-400/10 border-lime-400/50 text-lime-400'}`}>
      <p className="text-xs uppercase tracking-widest font-bold mb-1">Deadline Countdown</p>
      <p className="text-xl font-black font-mono">{timeLeft}</p>
    </div>
  )
}