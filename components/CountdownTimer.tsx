// components/CountdownTimer.tsx
'use client'
import { useState, useEffect, useLayoutEffect } from 'react'

export default function CountdownTimer({ 
  deadline, 
  initialIsExpired 
}: { 
  deadline: string, 
  initialIsExpired: boolean 
}) {
  const [isExpired, setIsExpired] = useState(initialIsExpired)
  const [timeLeft, setTimeLeft] = useState<string | null>(null) // เริ่มต้นด้วย null

  // useLayoutEffect จะทำงานก่อนที่ Browser จะวาดภาพ (Paint)
  // ช่วยแก้ปัญหาการ "แว๊บ" ได้ดีกว่า useEffect ธรรมดา
  useLayoutEffect(() => {
    const calculate = () => {
      const now = new Date().getTime()
      const target = new Date(deadline).getTime()
      const distance = target - now

      if (distance <= 0) {
        setTimeLeft("DEADLINE PASSED")
        setIsExpired(true)
      } else {
        const d = Math.floor(distance / (1000 * 60 * 60 * 24))
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const s = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeLeft(`${d}d ${h}h ${m}m ${s}s`)
        setIsExpired(false)
      }
    }
    calculate()
    const timer = setInterval(calculate, 1000)
    return () => clearInterval(timer)
  }, [deadline])

  // ถ้า timeLeft ยังเป็น null (จังหวะเสี้ยววินาทีแรกที่กำลังคำนวณ) 
  // ให้แสดงกล่องเปล่าที่มีสีตาม initialIsExpired ไปก่อน จะไม่เห็นตัวหนังสือแว๊บ
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