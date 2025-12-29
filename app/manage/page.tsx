// app/manage/page.tsx
'use client'
import { useState } from 'react'
import { fetchAndSaveFixtures, calculatePoints } from './actions'

export default function Manage() {
  const [syncGw, setSyncGw] = useState('') // สำหรับดึงข้อมูล
  const [calcGw, setCalcGw] = useState('') // สำหรับคำนวณคะแนน
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSync = async () => {
    if (!syncGw) return alert('Please enter GW to sync')
    setLoading(true)
    const result = await fetchAndSaveFixtures(Number(syncGw))
    setMessage(result.message)
    setLoading(false)
  }

  const handleCalculate = async () => {
    if (!calcGw) return alert('Please enter GW to calculate')
    setLoading(true)
    const result = await calculatePoints(Number(calcGw))
    setMessage(result.message)
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-[#020617] min-h-screen text-white">
      <h1 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
        ADMIN PANEL
      </h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${message.includes('success') ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="grid gap-6">
        {/* 1. ส่วน Sync ข้อมูล */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            1. Sync Fixtures & Stats
          </h2>
          <div className="flex gap-3">
            <input 
              type="number" 
              value={syncGw}
              onChange={(e) => setSyncGw(e.target.value)}
              placeholder="GW"
              className="w-24 bg-slate-950 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              onClick={handleSync}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-bold rounded-xl transition-all"
            >
              {loading ? 'SYNCING...' : 'SYNC FROM FPL'}
            </button>
          </div>
        </div>

        {/* 2. ส่วนคำนวณคะแนน */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-lime-500 rounded-full"></span>
            2. Calculate User Points
          </h2>
          <div className="flex gap-3">
            <input 
              type="number" 
              value={calcGw}
              onChange={(e) => setCalcGw(e.target.value)}
              placeholder="GW"
              className="w-24 bg-slate-950 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-lime-500 outline-none"
            />
            <button 
              onClick={handleCalculate}
              disabled={loading}
              className="flex-1 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-xl transition-all"
            >
              {loading ? 'CALCULATING...' : 'CALCULATE NOW'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}