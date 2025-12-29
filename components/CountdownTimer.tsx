// components/CountdownTimer.tsx
'use client'
import { useState, useEffect, useMemo } from 'react'

export default function CountdownTimer({ deadline }: { deadline: string }) {
  // 1. ใช้ useMemo เพื่อคำนวณสถานะ "ทันที" ตั้งแต่ Component เริ่มสร้าง
  // วิธีนี้จะทำให้ค่าเริ่มต้นไม่เป็นค่าว่างหรือ false เสมอไป แต่จะคำนวณจากเวลาปัจจุบันเลย
  const initialState = useMemo(() => {
    const now = new Date().getTime()
    const target = new Date(deadline).getTime()
    const distance = target - now
    
    if (distance <= 0) {
      return { text: "DEADLINE PASSED", expired: true }
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)
    
    return { 
      text: `${days}d ${hours}h ${minutes}m ${seconds}s`, 
      expired: false 
    }
  }, [deadline])

  const [timeLeft, setTimeLeft] = useState(initialState.text)
  const [isExpired, setIsExpired] = useState(initialState.expired)

  // 2. อัปเดตทุกวินาทีตามปกติ
  useEffect(() => {
    // รีเซ็ตค่าตาม initialState ทันทีที่ deadline เปลี่ยน (เพื่อแก้ปัญหาตอนสลับ GW)
    setTimeLeft(initialState.text)
    setIsExpired(initialState.expired)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(deadline).getTime()
      const distance = target - now

      if (distance <= 0) {
        setTimeLeft("DEADLINE PASSED")
        setIsExpired(true)
        clearInterval(timer)
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        setIsExpired(false)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline, initialState])

  return (
    <div className={`text-center p-3 rounded-xl border transition-all duration-300 ${
      isExpired 
        ? 'bg-red-500/10 border-red-500/50 text-red-400' 
        : 'bg-lime-400/10 border-lime-400/50 text-lime-400'
    }`}>
      <p className="text-xs uppercase tracking-widest font-bold mb-1">Deadline Countdown</p>
      <p className="text-xl font-black font-mono">{timeLeft}</p>
    </div>
  )
}