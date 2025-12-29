// app/manage/page.tsx
'use client'
import { useState } from 'react'
import { fetchAndSaveFixtures, calculatePoints } from './actions' // เพิ่ม calculatePoints

export default function Manage() {
  const [gw, setGw] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFetch = async () => {
    if (!gw) return alert('Please enter Gameweek')
    setLoading(true)
    const result = await fetchAndSaveFixtures(Number(gw))
    setMessage(result.message)
    setLoading(false)
  }

  // เพิ่มฟังก์ชันสำหรับเรียก Calculate
  const handleCalculate = async () => {
    if (!gw) return alert('Please enter Gameweek')
    if (!confirm(`Are you sure to calculate points for GW ${gw}?`)) return
    
    setLoading(true)
    const result = await calculatePoints(Number(gw))
    setMessage(result.message)
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto bg-slate-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>

      {message && (
        <p className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message}
        </p>
      )}

      <div className="space-y-8">
        {/* ส่วนเดิม: Sync Fixtures */}
        <section className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">1. Sync Data from FPL</h2>
          <input 
            type="number" 
            value={gw}
            onChange={(e) => setGw(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 p-2 rounded mb-3 text-white"
            placeholder="Enter Gameweek (e.g. 17)"
          />
          <button 
            onClick={handleFetch}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Sync Fixtures'}
          </button>
        </section>

        {/* ส่วนใหม่: Calculate Scores */}
        <section className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-lime-400">2. Calculate Points</h2>
          <p className="text-sm text-slate-400 mb-4">* Compare user predictions with real scores and update points in DB.</p>
          <button 
            onClick={handleCalculate}
            disabled={loading}
            className="w-full bg-lime-500 hover:bg-lime-600 text-black py-2 rounded font-bold disabled:opacity-50"
          >
            {loading ? 'Calculating...' : `Calculate GW ${gw || ''} Points`}
          </button>
        </section>
      </div>
    </div>
  )
}