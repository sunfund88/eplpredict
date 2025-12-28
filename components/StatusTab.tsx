'use client'
import { useState, useEffect } from 'react'

interface StatusTabProps {
  nextGW: number;
  onNavigate: () => void; // ฟังก์ชันสำหรับเปลี่ยนหน้าไป PredictTab
}

export default function StatusTab({ nextGW, onNavigate }: StatusTabProps) {
  return (
    <div className="flex flex-col gap-4 p-4 text-white min-h-screen">
      
      {/* 1. บอก GW ถัดไป + ปุ่มกดไปหน้า Predict */}
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

      {/* 2. GW ที่กำลังแข่งและยังไม่จบ (Live/Processing) */}
      {/* สมมติว่า Live GW คือช่วงรอยต่อก่อนจะตัดเข้า Next GW เต็มตัว */}
      <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-500/30">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-blue-400 font-bold text-sm uppercase">Live Status</h3>
        </div>
        <p className="text-sm opacity-80">
          Fixtures in <span className="font-bold text-white text-md">GW {nextGW - 1}</span> are currently being played or processed.
        </p>
      </div>

      {/* 3. แสดงสถานะการอัพเดทสกอร์ของ GW ล่าสุด (nextGW-1) */}
      <div className="bg-black/30 p-4 rounded-lg border border-white/5">
        <h3 className="text-gray-400 font-bold text-sm uppercase mb-2">Last Update (GW {nextGW - 1})</h3>
        <div className="flex items-center justify-between bg-black/40 p-3 rounded">
          <span className="text-sm">Score Synchronization</span>
          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold border border-green-500/30">
            UPDATED
          </span>
        </div>
        <p className="mt-2 text-[10px] text-gray-500 italic">
          *Scores are automatically synced with the Premier League official data.
        </p>
      </div>

    </div>
  )
}