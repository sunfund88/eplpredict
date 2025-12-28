// StatusTab.tsx
'use client'
import { useState, useEffect } from 'react'

interface StatusTabProps {
  nextGW: number;
  finishedGW: number;
  calculatedGW: number;
  isLive: boolean;
  onNavigate: () => void;
}

export default function StatusTab({ nextGW, finishedGW, calculatedGW, isLive, onNavigate }: StatusTabProps) {
  return (
    <div className="flex flex-col gap-4 p-4 text-white min-h-screen">
      
      {/* 1. Upcoming Gameweek */}
      <div className="bg-white/10 p-4 rounded-lg border border-white/20">
        <h3 className="text-yellow-400 font-bold mb-1">Upcoming Gameweek</h3>
        <p className="text-2xl font-bold mb-3">Gameweek {nextGW}</p>
        <button 
          onClick={onNavigate}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3 rounded uppercase transition-colors"
        >
          Go to Prediction
        </button>
      </div>

      {/* 2. Live Status (เช็คจากค่า isLive) */}
      <div className={`p-4 rounded-lg border ${isLive ? 'bg-blue-600/20 border-blue-500/30' : 'bg-gray-800/20 border-white/10'}`}>
        <div className="flex items-center gap-2 mb-1">
          {/* แสดงไฟสถานะเฉพาะตอน isLive เป็น true */}
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <h3 className={`${isLive ? 'text-blue-400' : 'text-gray-400'} font-bold text-sm uppercase`}>
            Live Status
          </h3>
        </div>
        
        {isLive ? (
          <p className="text-sm opacity-80">
            Fixtures in <span className="font-bold text-white text-md">GW {nextGW - 1}</span> are currently being played or processed.
          </p>
        ) : (
          <p className="text-sm opacity-50 italic">
            No live matches at the moment.
          </p>
        )}
      </div>

      {/* 3. Last Update (GW ที่อัปเดตสกอร์แล้ว) */}
      <div className="bg-black/30 p-4 rounded-lg border border-white/5">
        <h3 className="text-gray-400 font-bold text-sm uppercase mb-2 text-center">Last Update (GW {calculatedGW})</h3>
        <div className="flex items-center justify-between bg-black/40 p-3 rounded">
          <span className="text-sm">Score Synchronization</span>
          {(calculatedGW>=finishedGW) ? (
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold border border-green-500/30 uppercase">
                Updated
            </span>
          ):(
            <span className="bg-grey-500/20 text-grey-400 text-xs px-2 py-1 rounded font-bold border border-grey-500/30 uppercase">
                PENDING GW{finishedGW}
            </span>
          )}
        </div>
        <p className="mt-2 text-[10px] text-gray-500 italic text-center">
          *Scores are automatically synced with the Premier League official data.
        </p>
      </div>

    </div>
  )
}