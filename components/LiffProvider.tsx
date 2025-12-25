'use client' // กำหนดว่าเป็น Client Component

import { useEffect } from 'react'
import liff from '@line/liff'

export default function LiffProvider() {
  useEffect(() => {
    // ตรวจสอบว่ารันบน Browser เท่านั้น
    const initLiff = async () => {
      try {
        await liff.init({ liffId: '2008765764-h2ZtwGDM' })
        if (!liff.isLoggedIn()) {
          liff.login()
        }
      } catch (error) {
        console.error('LIFF Initialization failed', error)
      }
    }

    initLiff()
  }, [])

  return null // Component นี้ไม่ต้องแสดงผลอะไร
}