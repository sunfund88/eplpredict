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
  // ใช้หมากหลอกเพื่อให้ React ยอม Re-render ทุกวินาที
  const [, setTick] = useState(0)

  // คำนวณค่าสดๆ ทุกครั้งที่ Component นี้ทำงาน (Render)
  // วิธีนี้จะทำให้ไม่มีจังหวะที่ค่าเป็น "" หรือ "DEADLINE PASSED" เพราะมันคำนวณก่อนส่งไปที่ return
  const now = new Date().getTime()
  const target = new Date(deadline).getTime()
  const distance = target - now

  useEffect(() => {
    if (distance <= 0) {
      onExpire()
      return
    }

    const timer = setInterval(() => {
      setTick(t => t + 1) // สั่ง Re-render ทุกวินาที
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline, distance, onExpire])

  // ถ้าเวลาหมด ไม่ต้องแสดงอะไรเลย (หายไปเลย) หรือจะแสดงแถบ Locked ก็ได้
  if (distance <= 0) {
    return null 
  }

  // แปลงตัวเลขเป็นข้อความ
  const d = Math.floor(distance / (1000 * 60 * 60 * 24))
  const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((distance % (1000 * 60)) / 1000)
  const displayTime = `${d}d ${h}h ${m}m ${s}s`

  return (
    <div className="text-center p-3 rounded border bg-lime-400/10 border-lime-400/50 text-lime-400 transition-opacity duration-300">
      <p className="text-xs uppercase tracking-widest font-bold mb-1">Time Remaining</p>
      <p className="text-xl font-black font-mono">{displayTime}</p>
    </div>
  )
}