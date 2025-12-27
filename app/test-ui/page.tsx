'use client'
import { useState, useEffect } from 'react'
import { getTeamLogo, getTeamName } from '@/lib/teams'

export default function Test() {
    
      return (
        <div className="flex flex-col bg-[#38003c] min-h-screen text-white p-4">
          {/* ส่วนหัวแสดงเลข Gameweek */}
          <div className="flex items-center justify-between mb-6">
            <button 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <span className="text-xl">❮</span>
            </button>
    
            <div className="text-center">
              <h2 className="text-xl font-bold">Gameweek 18</h2>
              <p className="text-xs text-gray-300">ผลการแข่งขันประจำสัปดาห์</p>
            </div>
    
            <button 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <span className="text-xl">❯</span>
            </button>
          </div>
    
          {/* รายการผลการแข่งขัน */}
          <div className="flex flex-col gap-4">
            <div key={0} className="flex items-center justify-between border-b border-white/10 pb-4">
                  {/* ทีมเหย้า */}
                  <div className="flex-1 flex items-center justify-end gap-3 text-right">
                    <span className="font-semibold text-sm">{getTeamName(14)}</span>
                    <img src={getTeamLogo(14)} alt="home-logo" className="w-8 h-8" />
                  </div>
    
                  {/* สกอร์ */}
                  <div className="mx-4 bg-[#1b001d] px-4 py-2 rounded font-bold text-lg min-w-[80px] text-center shadow-inner">
                    8 - 5
                  </div>
    
                  {/* ทีมเยือน */}
                  <div className="flex-1 flex items-center justify-start gap-3 text-left">
                    <img src={getTeamLogo(15)} alt="away-logo" className="w-8 h-8" />
                    <span className="font-semibold text-sm">{getTeamName(15)}</span>
                  </div>
                </div>
          </div>
        </div>
      )
}