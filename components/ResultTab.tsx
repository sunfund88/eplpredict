'use client'
import { useState, useEffect } from 'react'
import { getResultActiveGW, getFixturesByGW } from '@/app/actions/home'

interface Fixture {
  id: string;
  gw: string;
  kickoff: Date;
  home: string;
  away: string;
  homeScore: string;
  awayScore: number;
  finished: boolean
  multiplier: number
  goalsScored: JSON   
  assists: JSON  
}

export default function ResultTab({ initialFixtures = [] }: { initialFixtures?: Fixture[] }) {
  const [currentGW, setCurrentGW] = useState<number>(1)
  const [fixtures, setFixtures] = useState<Fixture[]>(initialFixtures)
  const [loading, setLoading] = useState(true)

  // ดึงค่า GW เริ่มต้นเมื่อเข้าหน้า Tab ครั้งแรก
  useEffect(() => {
    const initData = async () => {
      setLoading(true)
      try {
        const activeGW = await getResultActiveGW()
        setCurrentGW(activeGW)
        
        // ดึงข้อมูลและระบุ Type
        const data = await getFixturesByGW(activeGW)
        if (data && data.fixtures) {
          setFixtures(data.fixtures as Fixture[])
        }
      } catch (error) {
        console.error("Failed to fetch fixtures:", error)
      } finally {
        setLoading(false)
      }
    }
    initData()
  }, [])

  // ฟังก์ชันเปลี่ยน GW เมื่อกดลูกศร
  const handleGWChange = async (newGW: number) => {
    if (newGW < 1 || newGW > 38) return
    setLoading(true)
    setCurrentGW(newGW)
    const data = await getFixturesByGW(newGW)
    setFixtures(data.fixtures)
    setLoading(false)
  }
  return (
    <div className="flex flex-col bg-[#38003c] min-h-screen text-white p-4">
      {/* ส่วนหัวแสดงเลข Gameweek */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => handleGWChange(currentGW - 1)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20"
        >
          <span className="text-xl">❮</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold">Gameweek {currentGW}</h2>
          <p className="text-xs text-gray-300">ผลการแข่งขันประจำสัปดาห์</p>
        </div>

        <button 
          onClick={() => handleGWChange(currentGW + 1)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20"
        >
          <span className="text-xl">❯</span>
        </button>
      </div>

      {/* รายการผลการแข่งขัน */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-center py-10 opacity-50">กำลังโหลด...</p>
        ) : (
          fixtures.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between border-b border-white/10 pb-4">
              {/* ทีมเหย้า */}
              <div className="flex-1 flex items-center justify-end gap-3 text-right">
                <span className="font-semibold text-sm">{item.home}</span>
                <img src={item.home} alt="" className="w-8 h-8 object-contain" />
              </div>

              {/* สกอร์ */}
              <div className="mx-4 bg-[#1b001d] px-4 py-2 rounded font-bold text-lg min-w-[80px] text-center shadow-inner">
                {item.homeScore} - {item.awayScore}
              </div>

              {/* ทีมเยือน */}
              <div className="flex-1 flex items-center justify-start gap-3 text-left">
                <img src={item.away} alt="" className="w-8 h-8 object-contain" />
                <span className="font-semibold text-sm">{item.away}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}