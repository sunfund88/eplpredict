// components/UserProfileView.tsx
'use client'
import { ArrowLeft } from "lucide-react"
import { getTeamLogo, getTeamShortName } from '@/lib/teams'

export default function UserProfileView({ user, isOwnProfile, onBack }: any) {
  return (
    <div className="flex flex-col bg-[#38003c] min-h-screen relative">
      {/* ปุ่มย้อนกลับ เพื่อปิดหน้าโปรไฟล์ */}
      <button 
        onClick={onBack}
        className="fixed top-5 left-5 p-2 bg-black/40 hover:bg-black/60 rounded-full border border-white/20"
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
           <div className="grid gap-4">
            {user.predictions && user.predictions.length > 0 ? (
              user.predictions.map((pred: any) => (
                <div 
                  key={pred.id} 
                  className="pred-history-card"
                >
                  {/* แถวบน: Gameweek และสถานะ */}
                  <div className="header">
                    <span className="header-gw">
                      Gameweek {pred.gw}
                    </span>
                    {pred.finished === 'FINISHED' ? (
                      <span className="header-finished">
                        Finished
                      </span>
                    ):(
                      <span className="header-pening">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* แถวกลาง: ผลการแข่งขันจริง (แทน Fixture IDเดิม) */}
                  <div className="body">
                    {/* ทีมเหย้า */}
                    <div className="body-team items-end">
                      <div className="flex items-center gap-2 px-2">
                        <span className="text-lg font-bold text-right">
                          {getTeamShortName(pred.fixture?.home)}
                        </span>
                        <img 
                          src={getTeamLogo(pred.fixture?.home)} 
                          alt="home" 
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                    </div>
                    {/* สกอร์จริง */}
                    <div className="flex items-center justify-center gap-1 px-3">
                      <span className="text-lg font-black font-mono">
                        {pred.fixture?.homeScore ?? '-'}
                      </span>
                      <span className="opacity-30">-</span>
                      <span className="text-lg font-black font-mono">
                        {pred.fixture?.awayScore ?? '-'}
                      </span>
                    </div>

                    {/* ทีมเยือน */}
                    <div className="body-team items-start">
                      <div className="flex items-center gap-2 px-2">
                        <img 
                          src={getTeamLogo(pred.fixture?.away)} 
                          alt="away" 
                          className="w-10 h-10 object-contain"
                        />
                        <span className="text-lg font-bold text-left">
                          {getTeamShortName(pred.fixture?.away)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* แถวล่าง: ผลการทายและคะแนนที่ได้รับ */}
                  <div className="footer">
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-50 uppercase font-bold">User Pred:</span>
                      <span className="text-lg font-bold text-white bg-white/10 px-4 py-0.5 rounded-sm">
                        {pred.predHome}-{pred.predAway}
                      </span>
                    </div>
                    
                    <div className="flex text-white items-center gap-2">
                      <span className="text-sm opacity-50 uppercase font-bold">Pts:</span>
                      <span className={`text-2xl font-bold ${pred.score > 0 ? 'text-[#00ff85]' : 'text-white/30'}`}>
                        +{pred.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-30 italic text-sm">
                No history available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}