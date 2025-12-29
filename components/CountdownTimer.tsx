// components/CountdownTimer.tsx
'use client'
import { useState, useEffect } from 'react'

export default function CountdownTimer({ 
  deadline, 
  onExpire 
}: { 
  deadline: string, 
  onExpire: () => void 
}) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculate = () => {
      const distance = new Date(deadline).getTime() - new Date().getTime()

      if (distance <= 0) {
        onExpire() // แจ้งแม่ว่าหมดเวลาแล้วนะ
        return
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24))
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((distance % (1000 * 60)) / 1000)
      setTimeLeft(`${d}d ${h}h ${m}s`)
    }

    calculate()
    const timer = setInterval(calculate, 1000)
    return () => clearInterval(timer)
  }, [deadline, onExpire])

  // ถ้าคำนวณครั้งแรกแล้ว distance <= 0 ตัว timeLeft จะเป็นค่าว่าง และ Component จะหายไปในรอบถัดไป
  if (!timeLeft) return null

  return (
    <div className="text-center p-3 rounded-xl border bg-lime-400/10 border-lime-400/50 text-lime-400">
      <p className="text-xs uppercase tracking-widest font-bold mb-1">Time Remaining</p>
      <p className="text-xl font-black font-mono">{timeLeft}</p>
    </div>
  )
}