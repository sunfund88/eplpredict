// app/user/[lineId]/page.tsx
export const dynamic = 'force-dynamic'

import { getUserDetail } from "@/app/actions/user"
import { notFound } from "next/navigation"
import Link from "next/link"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { ArrowLeft, LogOut } from "lucide-react"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export default async function UserDetailPage({ params }: { params: { lineId: string } }) {
  const { lineId } = await params
  const user = await getUserDetail(lineId)

  if (!user) {
    return notFound()
  }

  let isOwnProfile = false

  const cookieStore = await cookies()
  const token = cookieStore.get('user_session')?.value

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret)
      // เทียบ lineId จาก Token กับ lineId จาก URL
      if (payload.lineId === lineId) {
        isOwnProfile = true
      }
    } catch (err) {
      console.error("JWT Verify Error")
    }
  }
  // --------------------------------------------

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#38003c] relative">
      {/* ปุ่มย้อนกลับ (มุมซ้ายบน) */}
      <Link 
        href="/" 
        className="absolute top-4 left-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
      >
        <ArrowLeft className="text-white w-6 h-6" />
      </Link>

      <div className="bg-gradient-to-b from-[#00ff85] to-[#38003c] p-1 h-32"></div>
      
      <div className="px-6 -mt-16">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-8 border-[#38003c] overflow-hidden bg-slate-800 shadow-2xl relative">
            <img 
              src={user.image || "/default-avatar.png"} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mt-4 flex items-center gap-3">
            <h1 className="text-3xl font-black italic uppercase text-white leading-none">
              {user.name}
            </h1>
            
            {/* แสดงปุ่ม Log-out เฉพาะเมื่อเป็นเจ้าของโปรไฟล์เท่านั้น */}
            {isOwnProfile && (
              <Link 
                href="/logout" 
                className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors border border-red-500/30"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="mt-2 inline-block px-4 py-1 bg-[#00ff85] text-[#38003c] rounded-full font-bold text-sm uppercase">
            {user.score.toLocaleString()} Total Points
          </div>
        </div>

        {/* Prediction History List (คงเดิมตามที่คุณเขียนไว้) */}
        <div className="mt-10 max-w-2xl mx-auto pb-20">
          <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-2 uppercase italic tracking-wider">
            Prediction History
          </h2>
          
          <div className="grid gap-4">
            {user.predictions && user.predictions.length > 0 ? (
              user.predictions.map((pred: any) => (
                <div key={pred.id} className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#00ff85] uppercase">Gameweek {pred.gw}</span>
                    <span className="text-sm opacity-50 font-mono">Fixture ID: {pred.fixtureId}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 px-4 py-2 rounded-xl text-center min-w-[80px]">
                      <p className="text-[10px] opacity-50 mb-1 uppercase">Pred.</p>
                      <p className="text-xl font-black font-mono">{pred.predHome}-{pred.predAway}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] opacity-50 mb-1 uppercase">Pts</p>
                      <p className="text-xl font-black text-[#00ff85]">+{pred.score}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-30 italic">No history available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}