// CountdownTimer.tsx
'use client'
import { useState, useEffect } from 'react'

export default function CountdownTimer({ deadline, initialIsExpired }: { deadline: string, initialIsExpired: boolean }) {
  // ใช้ค่าที่ส่งมาจากแม่เป็นค่าเริ่มต้นทันที
  const [isExpired, setIsExpired] = useState(initialIsExpired)
  const [timeLeft, setTimeLeft] = useState(initialIsExpired ? "DEADLINE PASSED" : "")

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime()
      const target = new Date(deadline).getTime()
      const distance = target - now

      if (distance <= 0) {
        setTimeLeft("DEADLINE PASSED")
        setIsExpired(true)
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        setIsExpired(false)
      }
    }

    calculate() // รันซ้ำเพื่อความแม่นยำ
    const timer = setInterval(calculate, 1000)
    return () => clearInterval(timer)
  }, [deadline])

  return (
    <div className={`text-center p-3 rounded-xl border transition-all duration-300 ${
      isExpired 
        ? 'bg-red-500/10 border-red-500/50 text-red-400' 
        : 'bg-lime-400/10 border-lime-400/50 text-lime-400'
    }`}>
      <p className="text-xs uppercase tracking-widest font-bold mb-1">Deadline Countdown</p>
      <p className="text-xl font-black font-mono">
        {timeLeft || "---"} 
      </p>
    </div>
  )
}