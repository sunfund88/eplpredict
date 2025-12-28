'use client'
import { useState, useEffect } from 'react'
import { getFixturesByGW, getUserPredictions } from '@/app/actions/home'
import PredictionRow from './PredictionRow' // Import row ที่สร้างใหม่

export default function PredictTab({ userId, nextGW }: { userId: string, nextGW:number }) {
  const [currentGW, setCurrentGW] = useState<number>(nextGW)
  const [fixtures, setFixtures] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async (gw: number) => {
    setLoading(true)
    const data = await getFixturesByGW(gw)
    if (data && data.fixtures) {
      setFixtures(data.fixtures)
      // ดึงข้อมูลการทายของผู้ใช้สำหรับ Fixtures เหล่านี้
      const fIds = data.fixtures.map((f: any) => f.id)
      const userPreds = await getUserPredictions(userId, fIds)
      setPredictions(userPreds)
    }
    setLoading(false)
  }

  useEffect(() => {
    const init = async () => {
      setCurrentGW(nextGW)
      await fetchData(nextGW)
    }
    init()
  }, [])

  const handleGWChange = async (newGW: number) => {
    if (newGW < 1 || newGW > nextGW) return
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
      <div className="flex flex-col">
        {loading ? (
          <p className="text-center py-10 opacity-50">Loading ...</p>
        ) : (
          fixtures.map((item) => (
            <PredictionRow 
              key={item.id} 
              fixture={item} 
              userId={userId}
              initialPrediction={predictions.find(p => p.fixtureId === item.id)}
              isPast={currentGW < nextGW}
            />
          ))
        )}
      </div>
    </div>
  )
}