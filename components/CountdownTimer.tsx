// components/CountdownTimer.tsx
'use client'
import { useState, useEffect } from 'react'

// components/CountdownTimer.tsx
export default function CountdownTimer({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('') // ค่าเริ่มต้นเป็นว่าง
  const [isExpired, setIsExpired] = useState(false)
  const [isReady, setIsReady] = useState(false) // เพิ่มตัวแปรเช็คความพร้อม

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
      setIsReady(true) // คำนวณเสร็จแล้วพร้อมแสดงผล
    }

    calculate() // รันครั้งแรกทันที
    const timer = setInterval(calculate, 1000)
    return () => clearInterval(timer)
  }, [deadline])

  // ถ้ายังคำนวณไม่เสร็จ ไม่ต้องแสดงแถบสีแดง/เขียว หรือข้อความ Deadlines
  if (!isReady) return <div className="p-3 h-[74px]"></div> 

  return (
    <div className={`text-center p-3 rounded-xl border transition-all duration-500 ${
      isExpired 
        ? 'bg-red-500/10 border-red-500/50 text-red-400' 
        : 'bg-lime-400/10 border-lime-400/50 text-lime-400'
    }`}>
      <p className="text-xs uppercase tracking-widest font-bold mb-1">Deadline Countdown</p>
      <p className="text-xl font-black font-mono">{timeLeft}</p>
    </div>
  )
}