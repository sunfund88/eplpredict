// app/userdetail/[lineId]/page.tsx
import { getUserDetail } from "@/app/actions/user"
import { notFound } from "next/navigation"

export default async function UserDetailPage({ params }: { params: { lineId: string } }) {
  // รับค่า lineId จาก URL
  const { lineId } = params
  const user = await getUserDetail(lineId)

  if (!user) {
    return notFound() // ถ้าไม่เจอ User ให้ขึ้น 404
  }

  return (
    <div className="min-h-screen bg-[#38003c] text-white p-6">
      {/* Header Profile */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-lime-400 overflow-hidden mb-4 shadow-xl">
          <img 
            src={user.image || "/default-avatar.png"} 
            alt={user.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-black italic">{user.name}</h1>
        <p className="text-lime-400 font-mono text-xl">Total Points: {user.score}</p>
      </div>

      {/* สถิติหรือข้อมูลอื่นๆ */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/10 p-4 rounded-2xl text-center border border-white/5">
          <p className="text-xs opacity-60 uppercase">Rank</p>
          <p className="text-xl font-bold">#--</p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl text-center border border-white/5">
          <p className="text-xs opacity-60 uppercase">Predictions</p>
          <p className="text-xl font-bold">{user.predictions.length}</p>
        </div>
      </div>

      {/* ประวัติการทายผลล่าสุด */}
      <h3 className="text-lg font-bold mb-4 px-2">Recent Predictions</h3>
      <div className="space-y-3">
        {user.predictions.map((pred: any) => (
          <div key={pred.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5">
            <div>
              <p className="text-xs text-slate-400">Gameweek {pred.gw}</p>
              <p className="font-bold text-sm">Fixture ID: {pred.fixtureId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-60">Score Predicted</p>
              <p className="font-mono text-lime-400">{pred.homeScore} - {pred.awayScore}</p>
              <p className="text-[10px] text-yellow-400">Earned: {pred.score} pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}