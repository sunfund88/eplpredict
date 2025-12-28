'use client'
import { useState, useEffect } from 'react'
import { getFixturesByGW, getUserPredictions, upsertPrediction } from '@/app/actions/home'
import PredictionRow from './PredictionRow' // Import row ที่สร้างใหม่

export default function PredictTab({ userId, nextGW }: { userId: string, nextGW:number }) {
  const [currentGW, setCurrentGW] = useState<number>(nextGW)
  const [fixtures, setFixtures] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [localScores, setLocalScores] = useState<Record<string, { home: number, away: number }>>({})

  // ฟังก์ชันสำหรับเก็บค่า score จากลูกๆ มาไว้ที่ตัวแม่
  const updateLocalScore = (fixtureId: string, home: number, away: number) => {
    setLocalScores(prev => ({
      ...prev,
      [fixtureId]: { home, away }
    }))
  }

  const handlePredictAll = async () => {
    setLoading(true)
    try {
      // วนลูปบันทึกเฉพาะที่มีการเปลี่ยนแปลงค่าใน localScores
      const promises = Object.entries(localScores).map(([fixtureId, scores]) => 
        upsertPrediction(userId, parseInt(fixtureId), scores.home, scores.away)
      )
      
      await Promise.all(promises)
      alert("บันทึกการทายผลทั้งหมดสำเร็จ!")
      // โหลดข้อมูลใหม่เพื่อให้ UI อัปเดตสถานะ Saved
      await fetchData(currentGW)
    } catch (error) {
      console.error(error)
      alert("เกิดข้อผิดพลาดในการบันทึกทั้งหมด")
    } finally {
      setLoading(false)
    }
  }

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
              testMode={true}// ส่งฟังก์ชันไปดึงค่า score
              onScoreChange={(home, away) => updateLocalScore(item.id, home, away)}
            />
          ))
        )}
      </div>

      {/* Floating Predict All Button */}
      {!loading && fixtures.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center">
          <button 
            onClick={handlePredictAll}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-all active:scale-95 w-full max-w-md border-2 border-white/20"
          >
            SAVE ALL PREDICTIONS
          </button>
        </div>
      )}
    </div>
  )
}