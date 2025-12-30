'use client'
import { useState, useEffect, useRef } from 'react'
import { getFixturesByGW, getUserPredictions, upsertPrediction, getGameweekInfo } from '@/app/actions/home'
import PredictionRow from './PredictionRow' // Import row ที่สร้างใหม่
import CountdownTimer from './CountdownTimer'

interface PredictionData {
  id: string;
  userId: string;
  fixtureId: number;
  gw: number;
  predHome: number;
  predAway: number;
  score: number;
  multiplier: number;
  createdAt: Date;
}

const checkIsExpired = (deadlineStr: string) => {
  return new Date().getTime() > new Date(deadlineStr).getTime()
}

export default function PredictTab({ userId, nextGW }: { userId: string, nextGW:number }) {
  const [currentGW, setCurrentGW] = useState<number>(nextGW)
  const [fixtures, setFixtures] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false); // เพิ่ม State สำหรับตอนส่งข้อมูล
  const [localScores, setLocalScores] = useState<Record<string, { home: number, away: number}>>({})
  const [deadline, setDeadline] = useState<string | null>(null)
  const [isPastDeadline, setIsPastDeadline] = useState(false)

  // --- ระบบ Caching ---
  // ใช้ useRef เพื่อเก็บข้อมูลโดยไม่ทำให้ Component re-render โดยไม่จำเป็น
  const cache = useRef<Record<number, { fixtures: any[], predictions: PredictionData[], deadline: string | null }>>({})

  // ฟังก์ชันดึงข้อมูลแบบฉลาด (Smart Fetch)
  const fetchData = async (gw: number, useCache = true) => {
    // 1. ตรวจสอบใน Cache ก่อน
    if (useCache && cache.current[gw]) {
      const cachedData = cache.current[gw]
      setFixtures(cachedData.fixtures)
      setPredictions(cachedData.predictions)
      setDeadline(cachedData.deadline)
      if (cachedData.deadline) {
        setIsPastDeadline(new Date().getTime() > new Date(cachedData.deadline).getTime())
      }
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // ดึงข้อมูลจาก API พร้อมกันเพื่อความเร็ว
      const [data, gwInfo] = await Promise.all([
        getFixturesByGW(gw),
        getGameweekInfo(gw)
      ])

      let fList: any[] = [] 
      let pList: PredictionData[] = [] // ระบุเป็น Array ของ PredictionData
      let dl: string | null = null
      
      if (data && data.fixtures) {
        fList = data.fixtures
        const fIds = fList.map((f: any) => f.id)
        pList = await getUserPredictions(userId, fIds)
      }

      if (gwInfo) {
        dl = gwInfo.gwDeadline.toISOString()
      }

      // 2. เก็บลง Cache
      cache.current[gw] = { fixtures: fList, predictions: pList, deadline: dl }

      // 3. แสดงผล
      setFixtures(fList)
      setPredictions(pList)
      setDeadline(dl)
      if (dl) setIsPastDeadline(new Date().getTime() > new Date(dl).getTime())
      
    } catch (error) {
      console.error("Fetch Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- ระบบ Prefetching (ดึงล่วงหน้า 3-5 GW) ---
  const prefetchGWs = async (startGW: number) => {
    const gwsToFetch = [startGW - 1, startGW - 2, startGW - 3, startGW - 4].filter(gw => gw >= 1)
    
    for (const gw of gwsToFetch) {
      if (!cache.current[gw]) {
        const data = await getFixturesByGW(gw)
        if (data && data.fixtures) {
          const fIds = data.fixtures.map((f: any) => f.id)
          
          // 2. ระบุ Type ให้กับ pList อย่างชัดเจนที่นี่
          const pList: PredictionData[] = await getUserPredictions(userId, fIds)
          
          const gwInfo = await getGameweekInfo(gw)
          cache.current[gw] = { 
            fixtures: data.fixtures, 
            predictions: pList, 
            deadline: gwInfo?.gwDeadline.toISOString() || null 
          }
        }
      }
    }
  }

  useEffect(() => {
    const init = async () => {
      await fetchData(nextGW) // โหลด GW ปัจจุบันก่อน
      prefetchGWs(nextGW)     // แล้วค่อยแอบโหลด GW อื่นๆ ทิ้งไว้
    }
    init()
  }, [])

  const handleGWChange = async (newGW: number) => {
    if (newGW < 1 || newGW > nextGW) return
    setCurrentGW(newGW)
    await fetchData(newGW)
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

  // ฟังก์ชันสำหรับเก็บค่า score จากลูกๆ มาไว้ที่ตัวแม่
  const updateLocalScore = (fixtureId: string, home: number, away: number) => {
    setLocalScores(prev => ({
      ...prev,
      [fixtureId]: { home, away }
    }))
  }

  // useEffect(() => {
  //   const init = async () => {
  //     setCurrentGW(nextGW)
  //     await fetchData(nextGW)
  //   }
  //   init()
  // }, [])


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
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => handleGWChange(currentGW - 1)} className="p-2">❮</button>
        <h2 className="text-xl font-bold">Gameweek {currentGW}</h2>
        <button onClick={() => handleGWChange(currentGW + 1)} className="p-2">❯</button>
      </div>

      {/* ส่วนนับเวลา: จะแสดงเฉพาะเมื่อยังไม่หมดเวลาเท่านั้น */}
      {deadline && currentGW === nextGW && !isPastDeadline && (
        <div className="mb-2">
          <CountdownTimer 
            key={deadline} 
            deadline={deadline} 
            onExpire={() => setIsPastDeadline(true)} // เมื่อนับจนครบ ให้สั่งล็อกหน้าจอทันที
          />
        </div>
      )}

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
              isPast={isPastDeadline || currentGW < nextGW}
              testMode={false}// ส่งฟังก์ชันไปดึงค่า score
              onScoreChange={(home, away) => updateLocalScore(item.id, home, away)}
            />
          ))
        )}
      </div>

      {/* Floating Predict All Button */}
      {!loading && fixtures.length > 0 && currentGW >= nextGW && (
        <div className="flex justify-center">
          <button 
            onClick={handlePredictAll}
            disabled={isPastDeadline || isSubmitting || Object.keys(localScores).length === 0}
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