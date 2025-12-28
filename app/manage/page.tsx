// app/manage/page.tsx
'use client'

import { useState } from 'react'
import { fetchAndSaveFixtures } from './actions'

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

  return (
    <div className="max-w-md mx-auto bg-green-400 text-black min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Welcome 🎉 ADMIN</h1>
      
      <div className="flex gap-4 items-center border p-6 rounded-lg bg-gray-50">
        <div>
          <label className="block text-sm font-medium mb-1">Gameweek (GW)</label>
          <input 
            type="number" 
            value={gw}
            onChange={(e) => setGw(e.target.value)}
            placeholder="e.g. 20"
            className="border p-2 rounded w-32 text-black"
          />
        </div>
        
        <button 
          onClick={handleFetch}
          disabled={loading}
          className={`mt-6 px-4 py-2 rounded text-white font-medium ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Updating...' : 'Sync Fixtures from FPL'}
        </button>
      </div>

      {message && (
        <p className={`mt-4 p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
