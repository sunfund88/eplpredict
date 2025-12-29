'use client'
import { useState, useEffect } from 'react'
import { getFixturesByGW, getUserPredictions, upsertPrediction } from '@/app/actions/home'
import PredictionRow from './PredictionRow' // Import row ที่สร้างใหม่

export default function PredictTab({ userId, nextGW }: { userId: string, nextGW:number }) {
  const [currentGW, setCurrentGW] = useState<number>(nextGW)
  const [fixtures, setFixtures] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false); // เพิ่ม State สำหรับตอนส่งข้อมูล
  const [localScores, setLocalScores] = useState<Record<string, { home: number, away: number}>>({})

  // ฟังก์ชันสำหรับเก็บค่า score จากลูกๆ มาไว้ที่ตัวแม่
  const updateLocalScore = (fixtureId: string, home: number, away: number) => {
    setLocalScores(prev => ({
      ...prev,
      [fixtureId]: { home, away }
    }))
  }

  const handlePredictAll = async () => {
    if (Object.keys(localScores).length === 0) {
      alert("No data changes.");
      return;
    }

    setIsSubmitting(true); // เริ่ม Animation การส่งข้อมูล
    try {
      const promises = Object.entries(localScores).map(([fixtureId, scores]) => 
        upsertPrediction(userId, parseInt(fixtureId), currentGW, scores.home, scores.away)
      );
      
      await Promise.all(promises);
      
      // เมื่อเสร็จแล้ว ให้โหลดข้อมูลใหม่จาก Server เพื่ออัปเดตสถานะปุ่มในแต่ละ Row
      await fetchData(currentGW); 
      setLocalScores({}); // ล้างค่าที่ค้างอยู่ใน local state
      alert("All data successfully saved!");
    } catch (error) {
      console.error(error);
      alert("An error occurred during recording.");
    } finally {
      setIsSubmitting(false); // ปิด Animation
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
    <div className="relative flex flex-col bg-[#38003c] min-h-screen text-white p-4 pb-24">      
      {/* --- Full Screen Loading Animation --- */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-t-lime-400 border-white/20 rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-bold animate-pulse text-white">Sending data to Database...</p>
        </div>
      )}

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
        <div className="flex justify-center">
          <button 
            onClick={handlePredictAll}
            disabled={isSubmitting || Object.keys(localScores).length === 0}
            className={`${
              isSubmitting || Object.keys(localScores).length === 0 
              ? 'w-full bg-gray-600 opacity-50 cursor-not-allowed' 
              : 'w-full bg-lime-400 hover:bg-lime-500'
            } text-black font-black py-3 rounded uppercase transition-colors`}
          >
            {isSubmitting ? 'SAVING...' : 'SAVE ALL PREDICTIONS'}
          </button>
        </div>
      )}
    </div>
  )
}