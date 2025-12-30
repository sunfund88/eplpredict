// components/UserProfileView.tsx
'use client'
import { ArrowLeft } from "lucide-react"
import { getTeamLogo, getTeamShortName } from '@/lib/teams'

export default function UserProfileView({ user, isOwnProfile, onBack }: any) {
  return (
    <div className="flex flex-col bg-[#38003c] min-h-screen relative z-[50]">
      {/* ปุ่มย้อนกลับ เพื่อปิดหน้าโปรไฟล์ */}
      <button 
        onClick={onBack}
        className="fixed top-5 left-5 z-[100] p-2 bg-black/40 hover:bg-black/60 rounded-full border border-white/20"
      >
        <ArrowLeft className="text-white w-6 h-6" />
      </button>

      {/* Profile Header & Info (ยกจากหน้าเดิมมาเลย) */}
      <div className="bg-gradient-to-b from-[#00ff85] to-[#38003c] h-32"></div>
      <div className="px-6 -mt-16">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-8 border-[#38003c] overflow-hidden bg-slate-800 shadow-2xl">
            <img src={user.image || "/default-avatar.png"} className="w-full h-full object-cover" />
          </div>
          <h1 className="mt-4 text-3xl font-black text-white italic uppercase">{user.name}</h1>
          
          {isOwnProfile && (
             <a href="/logout" className="mt-2 px-6 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full">LOGOUT</a>
          )}

          <div className="mt-3 px-4 py-1 bg-[#00ff85] text-[#38003c] rounded-full font-bold text-sm">
            {user.score.toLocaleString()} TOTAL POINTS
          </div>
        </div>

        {/* Prediction History... */}
        <div className="mt-8">
           <h3 className="text-white/50 text-xs font-bold uppercase mb-4">Prediction History</h3>
           {/* ... วนลูปแสดงประวัติเหมือนหน้าเดิม ... */}
        </div>
      </div>
    </div>
  )
}