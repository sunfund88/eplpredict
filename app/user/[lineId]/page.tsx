// app/user/[lineId]/page.tsx
export const dynamic = 'force-dynamic' // เพิ่มบรรทัดนี้เพื่อบังคับให้ดึงข้อมูลใหม่เสมอ

import { getUserDetail } from "@/app/actions/user"
import { notFound } from "next/navigation"

export default async function UserDetailPage({ params }: { params: { lineId: string } }) {
  const { lineId } = await params
  const user = await getUserDetail(lineId)

  if (!user) {
    console.log("User not found for lineId:", lineId) // จะแสดงใน log ของ Vercel
    return notFound()
  }

  return (
    <div className="min-h-screen bg-[#38003c] text-white">
      <div className="bg-gradient-to-b from-[#00ff85] to-[#38003c] p-1 h-32"></div>
      
      <div className="px-6 -mt-16">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-8 border-[#38003c] overflow-hidden bg-slate-800 shadow-2xl">
            <img 
              src={user.image || "/default-avatar.png"} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h1 className="mt-4 text-3xl font-black italic uppercase text-white">
            {user.name}
          </h1>
          <div className="mt-2 inline-block px-4 py-1 bg-[#00ff85] text-[#38003c] rounded-full font-bold text-sm uppercase">
            {user.score.toLocaleString()} Total Points
          </div>
        </div>

        {/* Prediction History */}
        <div className="mt-10 max-w-2xl mx-auto pb-20">
          <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-2 uppercase italic tracking-wider">
            Prediction History
          </h2>
          
          <div className="grid gap-4">
            {user.predictions && user.predictions.length > 0 ? (
              user.predictions.map((pred: any) => (
                <div 
                  key={pred.id} 
                  className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#00ff85] uppercase">
                      Gameweek {pred.gw}
                    </span>
                    <span className="text-sm opacity-50 font-mono">
                      Fixture ID: {pred.fixtureId}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 px-4 py-2 rounded-xl text-center min-w-[80px]">
                      <p className="text-[10px] opacity-50 mb-1 uppercase">Pred.</p>
                      <p className="text-xl font-black font-mono">
                        {pred.predHome}-{pred.predAway}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-[10px] opacity-50 mb-1 uppercase">Pts</p>
                      <p className="text-xl font-black text-[#00ff85]">
                        +{pred.score}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-30 italic">
                No history available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}