// components/ScoreboardTab.tsx
'use client'
import { useEffect, useState } from 'react'
import { getScoreboard } from '@/app/actions/home'

export default function ScoreboardTab({ scoreboardCache, onUserClick }: any) {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      // 1. ตรวจสอบใน Cache ก่อน
      if (scoreboardCache.current) {
        setUsers(scoreboardCache.current)
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const data = await getScoreboard()
        
        // 2. บันทึกลงใน Cache ของตัวแม่
        scoreboardCache.current = data
        
        setUsers(data)
      } catch (error) {
        console.error("Scoreboard Load Error:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [scoreboardCache]);

  if (loading) {
    return <div className="text-center py-20 text-white/50">Loading Rankings...</div>;
  }

  return (
    <div className="bg-[#38003c] min-h-screen p-4 text-white">
      <h2 className="text-2xl font-black mb-6 text-center text-lime-400 uppercase">
        Scoreboard
      </h2>

      <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/10 text-white text-xs uppercase tracking-widest">
              <th className="px-4 py-4 font-bold w-16 text-center">Rank</th>
              <th className="px-4 py-4 font-bold">Player</th>
              <th className="px-4 py-4 font-bold text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr 
                key={user.id} 
                onClick={() => onUserClick(user.lineId)}
                className={`border-b border-white/5 transition-colors hover:bg-white/10 ${
                  index === 0 ? 'bg-lime-400/10' : '' // ไฮไลท์อันดับ 1
                }`}
              >
                {/* ลำดับที่ */}
                <td className="px-4 py-5 text-center font-mono text-lg">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </td>

                {/* รูปและชื่อ User */}
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20 bg-slate-800">
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-indigo-500 to-purple-600">
                          {user.name?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                      {user.name || 'Anonymous'}
                    </span>
                  </div>
                </td>

                {/* คะแนน */}
                <td className="px-4 py-5 text-right font-black text-xl text-white">
                  {user.score.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="text-center py-10 text-white/30 italic">No rankings available yet.</p>
      )}
    </div>
  )
}