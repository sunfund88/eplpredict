'use client'
import { useState, useEffect } from 'react'
import { getPredictActiveGW, getFixturesByGW, getUserPredictions } from '@/app/actions/home'
import PredictionRow from './PredictionRow' // Import row ที่สร้างใหม่

export default function PredictTab() {
  const [currentGW, setCurrentGW] = useState<number>(0)
  const [minGW, setMinGW] = useState<number>(0)
  const [fixtures, setFixtures] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // สมมติ UserId (ในระบบจริงดึงจาก Session/Auth)
  const mockUserId = "user-123" 

  const fetchData = async (gw: number) => {
    setLoading(true)
    const data = await getFixturesByGW(gw)
    if (data && data.fixtures) {
      setFixtures(data.fixtures)
      // ดึงข้อมูลการทายของผู้ใช้สำหรับ Fixtures เหล่านี้
      const fIds = data.fixtures.map((f: any) => f.id)
      const userPreds = await getUserPredictions(mockUserId, fIds)
      setPredictions(userPreds)
    }
    setLoading(false)
  }

  useEffect(() => {
    const init = async () => {
      const activeGW = await getPredictActiveGW()
      setCurrentGW(activeGW)
      setMinGW(activeGW)
      await fetchData(activeGW)
    }
    init()
  }, [])

  const handleGWChange = async (newGW: number) => {
    if (newGW < minGW || newGW > (currentGW + 2)) return
    setCurrentGW(newGW)
    await fetchData(newGW)
  }

  return (
    <div className="flex flex-col bg-[#38003c] min-h-screen text-white p-4">
      {/* Header (เหมือนเดิม) */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => handleGWChange(currentGW - 1)} className="p-2">❮</button>
        <h2 className="text-xl font-bold">Gameweek {currentGW}</h2>
        <button onClick={() => handleGWChange(currentGW + 1)} className="p-2">❯</button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-center py-10 opacity-50">Loading ...</p>
        ) : (
          fixtures.map((item) => (
            <PredictionRow 
              key={item.id} 
              fixture={item} 
              userId={mockUserId}
              initialPrediction={predictions.find(p => p.fixtureId === item.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}