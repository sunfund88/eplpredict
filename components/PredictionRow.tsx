'use client'
import { useState } from 'react'
import { getTeamLogo, getTeamName } from '@/lib/teams'
import { upsertPrediction } from '@/app/actions/home'

interface PredictionRowProps {
  fixture: any;
  initialPrediction?: any;
  userId: string;
}

export default function PredictionRow({ fixture, initialPrediction, userId }: PredictionRowProps) {
  // ตั้งค่าเริ่มต้นเป็น 0 ถ้าไม่มีข้อมูลเดิม
  const [homeScore, setHomeScore] = useState<number>(initialPrediction?.predHome ?? 0)
  const [awayScore, setAwayScore] = useState<number>(initialPrediction?.predAway ?? 0)
  const [isSaved, setIsSaved] = useState(!!initialPrediction)

  const handleUpdateScore = (team: 'home' | 'away', delta: number) => {
    setIsSaved(false); // เมื่อกดปุ่ม ให้ถือว่ายังไม่ได้บันทึกค่าใหม่
    if (team === 'home') {
      setHomeScore(prev => Math.max(0, prev + delta)); // Math.max ป้องกันแต้มติดลบ
    } else {
      setAwayScore(prev => Math.max(0, prev + delta));
    }
  }

  const handlePredict = async () => {
    try {
      await upsertPrediction(userId, fixture.id, homeScore, awayScore)
      setIsSaved(true)
      alert("บันทึกการทายผลสำเร็จ!")
    } catch (error) {
      console.error(error)
      alert("เกิดข้อผิดพลาด")
    }
  }

  return (
    <div className="flex flex-col border-b border-white/10 pb-4 mb-4">
      <div className="flex items-center justify-between gap-4">
        
        {/* Home Team Section */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{getTeamName(fixture.home)}</span>
            <img src={getTeamLogo(fixture.home)} alt="home" className="w-8 h-8" />
          </div>
          {/* Home Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={() => handleUpdateScore('home', -1)}
              className="w-8 h-8 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 rounded text-xl"
            >-</button>
            <div className="w-12 bg-[#1b001d] py-1 rounded font-bold text-xl text-center shadow-inner">
              {homeScore}
            </div>
            <button 
              onClick={() => handleUpdateScore('home', 1)}
              className="w-8 h-8 flex items-center justify-center bg-green-500/20 hover:bg-green-500/40 rounded text-xl"
            >+</button>
          </div>
        </div>

        <div className="text-white font-bold text-xl self-end pb-2">VS</div>

        {/* Away Team Section */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <img src={getTeamLogo(fixture.away)} alt="away" className="w-8 h-8" />
            <span className="font-semibold text-sm">{getTeamName(fixture.away)}</span>
          </div>
          {/* Away Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={() => handleUpdateScore('away', -1)}
              className="w-8 h-8 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 rounded text-xl"
            >-</button>
            <div className="w-12 bg-[#1b001d] py-1 rounded font-bold text-xl text-center shadow-inner">
              {awayScore}
            </div>
            <button 
              onClick={() => handleUpdateScore('away', 1)}
              className="w-8 h-8 flex items-center justify-center bg-green-500/20 hover:bg-green-500/40 rounded text-xl"
            >+</button>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button 
          onClick={handlePredict}
          disabled={isSaved}
          className={`${isSaved ? 'bg-gray-600' : 'bg-green-500 hover:bg-green-600'} text-xs px-6 py-2 rounded font-bold transition-colors`}
        >
          {isSaved ? 'Saved' : 'Save Prediction'}
        </button>
        <button 
          onClick={() => window.location.href = `/fixture/${fixture.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-xs px-6 py-2 rounded font-bold"
        >
          Detail
        </button>
      </div>
    </div>
  )
}