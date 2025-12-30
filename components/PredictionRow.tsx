'use client'
import { useState } from 'react'
import { getTeamLogo, getTeamName, getTeamShortName } from '@/lib/teams'
import { upsertPrediction } from '@/app/actions/home'

interface PredictionRowProps {
  fixture: any;
  initialPrediction?: any;
  userId: string;
  isPast: boolean
  testMode: boolean
  onScoreChange?: (home: number, away: number) => void;
}

export default function PredictionRow({ fixture, initialPrediction, userId, isPast, testMode, onScoreChange }: PredictionRowProps) {
  const [homeScore, setHomeScore] = useState<number>(initialPrediction?.predHome ?? 0)
  const [awayScore, setAwayScore] = useState<number>(initialPrediction?.predAway ?? 0)
  const [isSaved, setIsSaved] = useState(!!initialPrediction)

  const handleUpdateScore = (team: 'home' | 'away', delta: number) => {
    setIsSaved(false);
    
    if (team === 'home') {
      const nextHome = Math.max(0, homeScore + delta);
      setHomeScore(nextHome);
      onScoreChange?.(nextHome, awayScore); // ส่งค่าใหม่ไปที่ตัวแม่
      if (initialPrediction && nextHome === initialPrediction.predHome && awayScore === initialPrediction.predAway) {
        setIsSaved(true);
      }
    } else {
      const nextAway = Math.max(0, awayScore + delta);
      setAwayScore(nextAway);
      onScoreChange?.(homeScore, nextAway); // ส่งค่าใหม่ไปที่ตัวแม่
      if (initialPrediction && homeScore === initialPrediction.predHome && nextAway === initialPrediction.predAway) {
        setIsSaved(true);
      }
    }
  };

  const handlePredict = async () => {
    try {
      await upsertPrediction(userId, fixture.id, fixture.gw, homeScore, awayScore)
      setIsSaved(true)
      initialPrediction.predHome = homeScore
      initialPrediction.predAway = awayScore
      alert("Data successfully saved!")
    } catch (error) {
      console.error(error)
      alert("An error occurred during recording.")
    }
  }

  if (isPast && !testMode) {
    return (
      <div className="flex items-center justify-between w-full border-b border-white/5 py-3 px-2">
        {/* ทีมเหย้า */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <span className="font-medium text-sm text-white">{getTeamShortName(fixture.home)}</span>
          <img src={getTeamLogo(fixture.home)} className="w-8 h-8" />
        </div>

        {/* สกอร์ตรงกลาง (พื้นหลังดำ) */}
        <div className="mx-4 bg-black/60 px-4 py-1 rounded-sm min-w-[70px] text-center">
          <span className="text-xl font-bold tracking-widest text-white">
            {fixture.homeScore ?? ''} - {fixture.awayScore ?? ''}
          </span>
        </div>

        {/* ทีมเยือน */}
        <div className="flex-1 flex items-center justify-start gap-3">
          <img src={getTeamLogo(fixture.away)} className="w-8 h-8" />
          <span className="font-medium text-sm text-white">{getTeamShortName(fixture.away)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixture-card ${isSaved ? 'bg-green-500/35' : 'bg-transparent'}`}>
      <div className="flex">
        {/* Home Team Section */}
        <div className="fixture-home">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-md">{getTeamShortName(fixture.home)}</span>
            <img src={getTeamLogo(fixture.home)} alt="home" className="w-10 h-10" />
          </div>
          {/* Home Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={() => handleUpdateScore('home', -1)}
              className="w-8 h-8 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 rounded text-xl"
            >-</button>
            <div className="w-12 bg-[#1b001d] py-1 rounded font-bold text-2xl text-center shadow-inner">
              {homeScore}
            </div>
            <button 
              onClick={() => handleUpdateScore('home', 1)}
              className="w-8 h-8 flex items-center justify-center bg-green-500/20 hover:bg-green-500/40 rounded text-xl"
            >+</button>
          </div>
        </div>

        <div className="px-4 pt-2 text-white font-bold text-md">
            VS
        </div>

        {/* Away Team Section */}
        <div className="fixture-away">
          <div className="flex items-center gap-2">
            <img src={getTeamLogo(fixture.away)} alt="away" className="w-10 h-10" />
            <span className="font-semibold text-md">{getTeamShortName(fixture.away)}</span>
          </div>
          {/* Away Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={() => handleUpdateScore('away', -1)}
              className="w-8 h-8 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 rounded text-xl"
            >-</button>
            <div className="w-12 bg-[#1b001d] py-1 rounded font-bold text-2xl text-center shadow-inner">
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
      <div className="fixture-button-group">
        <button 
          onClick={handlePredict}
          disabled={isSaved}
          className={`${isSaved ? 'bg-gray-600' : 'bg-green-500 hover:bg-green-600'} text-xs px-6 py-2 rounded font-bold transition-colors min-w-[150px]`}
        >
          {isSaved ? 'Saved' : 'Save Prediction'}
        </button>
        <button 
          onClick={() => window.location.href = `/fixture/${fixture.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-xs px-6 py-2 rounded font-bold min-w-[150px]"
        >
          Detail
        </button>
      </div>
    </div>
  )
}