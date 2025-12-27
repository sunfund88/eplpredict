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
  const [homeScore, setHomeScore] = useState(initialPrediction?.predHome ?? "")
  const [awayScore, setAwayScore] = useState(initialPrediction?.predAway ?? "")
  const [isSaved, setIsSaved] = useState(!!initialPrediction)

  const handlePredict = async () => {
    if (homeScore === "" || awayScore === "") return alert("กรุณาใส่สกอร์")
    
    try {
      await upsertPrediction(userId, fixture.id, Number(homeScore), Number(awayScore))
      setIsSaved(true)
      alert("บันทึกการทายผลสำเร็จ!")
    } catch (error) {
      console.error(error)
      alert("เกิดข้อผิดพลาด")
    }
  }

  return (
    <div className="flex flex-col border-b border-white/10 pb-4 mb-2">
      <div className="flex items-center justify-between mb-2">
        {/* Home Team */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <span className="font-semibold text-sm">{getTeamName(fixture.home)}</span>
          <img src={getTeamLogo(fixture.home)} alt="home" className="w-8 h-8" />
        </div>

        {/* Prediction Inputs */}
        <div className={`mx-2 flex gap-1 items-center px-2 py-1 rounded shadow-inner ${isSaved ? 'bg-green-700' : 'bg-[#1b001d]'}`}>
          <input 
            type="number" 
            value={homeScore}
            onChange={(e) => { setHomeScore(e.target.value); setIsSaved(false); }}
            className="w-10 text-center bg-white text-black rounded font-bold"
          />
          <span className="text-white">-</span>
          <input 
            type="number" 
            value={awayScore}
            onChange={(e) => { setAwayScore(e.target.value); setIsSaved(false); }}
            className="w-10 text-center bg-white text-black rounded font-bold"
          />
        </div>

        {/* Away Team */}
        <div className="flex-1 flex items-center justify-start gap-2">
          <img src={getTeamLogo(fixture.away)} alt="away" className="w-8 h-8" />
          <span className="font-semibold text-sm">{getTeamName(fixture.away)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-1">
        <button 
          onClick={handlePredict}
          className="bg-green-500 hover:bg-green-600 text-xs px-4 py-1 rounded font-bold"
        >
          {isSaved ? 'Updated' : 'Predict'}
        </button>
        <button 
          onClick={() => window.location.href = `/fixture/${fixture.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-xs px-4 py-1 rounded font-bold"
        >
          Detail
        </button>
      </div>
    </div>
  )
}