// app/user/[lineId]/page.tsx
export const dynamic = 'force-dynamic'

import { getUserDetail } from "@/app/actions/user"
import { notFound } from "next/navigation"
import Link from "next/link"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { ArrowLeft, LogOut } from "lucide-react"
import { getTeamLogo, getTeamName, getTeamShortName } from '@/lib/teams'

// ต้องใช้ Secret เดียวกับที่ใช้ใน Middleware
const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export default async function UserDetailPage({ params }: { params: { lineId: string } }) {
  const { lineId } = await params
  const user = await getUserDetail(lineId)

  if (!user) {
    return notFound()
  }

  // --- ส่วนเช็คว่าเป็นเจ้าของโปรไฟล์หรือไม่ ---
  let isOwnProfile = false
  const cookieStore = await cookies()
  const token = cookieStore.get('user_session')?.value

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret)

      if (payload.userId === user.id) {        
        isOwnProfile = true
      }
    } catch (err) {
      console.error("JWT Verify Error in Page:", err)
    }
  }
  // ---------------------------------------

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#38003c] relative">
      {/* ปุ่มย้อนกลับไปหน้าแรก (บนซ้าย) */}
      <Link 
        href="/" 
        className="absolute top-4 left-4 z-20 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-all border border-white/10"
      >
        <ArrowLeft className="text-white w-5 h-5" />
      </Link>

      {/* Header Profile Background */}
      <div className="bg-gradient-to-b from-[#00ff85] to-[#38003c] p-1 h-32"></div>
      
      <div className="px-6 -mt-16 relative z-10">
        <div className="flex flex-col items-center">
          {/* รูปโปรไฟล์ */}
          <div className="w-32 h-32 rounded-full border-8 border-[#38003c] overflow-hidden bg-slate-800 shadow-2xl">
            <img 
              src={user.image || "/default-avatar.png"} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* ชื่อและปุ่ม Logout */}
          <div className="mt-4 flex items-center gap-3">
            <h1 className="text-3xl font-black italic uppercase text-white leading-none">
              {user.name}
            </h1>
            
            {/* แสดงปุ่ม Logout เฉพาะเจ้าของบัญชีเท่านั้น */}
            {isOwnProfile && (
              <Link 
                href="/logout" 
                className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl transition-all border border-red-500/30 shadow-lg"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </Link>
            )}
          </div>

          <div className="mt-2 inline-block px-4 py-1 bg-[#00ff85] text-[#38003c] rounded-full font-bold text-sm uppercase tracking-wide">
            {user.score.toLocaleString()} Total Points
          </div>
        </div>

        {/* ประวัติการทายผล */}
        <div className="mt-10 max-w-2xl mx-auto pb-20">
          <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-2 uppercase italic tracking-wider opacity-80">
            Prediction History
          </h2>
          
          <div className="grid gap-4">
            {user.predictions && user.predictions.length > 0 ? (
              user.predictions.map((pred: any) => (
                <div 
                  key={pred.id} 
                  className="bg-white/5 border border-white/10 p-4 rounded-3xl flex flex-col gap-3 hover:bg-white/10 transition-all"
                >
                  {/* แถวบน: Gameweek และสถานะ */}
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-[#00ff85] uppercase tracking-widest">
                      Gameweek {pred.gw}
                    </span>
                    {pred.fixture?.status === 'FINISHED' && (
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full opacity-50">
                        Full Time
                      </span>
                    )}
                  </div>

                  {/* แถวกลาง: ผลการแข่งขันจริง (แทน Fixture IDเดิม) */}
                  <div className="flex items-center justify-between bg-black/20 py-3 px-4 rounded-2xl">
                    {/* ทีมเหย้า */}
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-bold uppercase tracking-tighter w-10 text-right">
                        {getTeamShortName(pred.fixture?.homeTeam)}
                      </span>
                      <img 
                        src={getTeamLogo(pred.fixture?.homeTeam)} 
                        alt="home" 
                        className="w-6 h-6 object-contain"
                      />
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
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <img 
                        src={getTeamLogo(pred.fixture?.awayTeam)} 
                        alt="away" 
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-xs font-bold uppercase tracking-tighter w-10 text-left">
                        {getTeamShortName(pred.fixture?.awayTeam)}
                      </span>
                    </div>
                  </div>

                  {/* แถวล่าง: ผลการทายและคะแนนที่ได้รับ */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-50 uppercase font-bold">Your Pred:</span>
                      <span className="text-sm font-black font-mono text-white bg-white/10 px-2 py-0.5 rounded-lg">
                        {pred.predHome}-{pred.predAway}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] opacity-50 uppercase font-bold">Pts:</span>
                      <span className={`text-lg font-black ${pred.score > 0 ? 'text-[#00ff85]' : 'text-white/30'}`}>
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