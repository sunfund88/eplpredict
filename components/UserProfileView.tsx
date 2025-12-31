// components/UserProfileView.tsx
'use client'
import { useState } from "react" 
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react" 
import { getTeamLogo, getTeamShortName } from '@/lib/teams'

export default function UserProfileView({ user, isOwnProfile, onBack }: any) {
  // 1. กำหนดค่าพื้นฐานสำหรับ Pagination
  const ITEMS_PER_PAGE = 5
  const [currentPage, setCurrentPage] = useState(1)

  const allPredictions = user.predictions || []
  const totalPages = Math.ceil(allPredictions.length / ITEMS_PER_PAGE)

  // 2. คำนวณช่วงของข้อมูลที่จะแสดงในหน้านั้นๆ
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE
  const currentItems = allPredictions.slice(indexOfFirstItem, indexOfLastItem)

  // 3. ฟังก์ชันเปลี่ยนหน้า
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // เลื่อนหน้าจอกลับขึ้นไปด้านบนของส่วนประวัติ (Optional)
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }

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
      <div className="px-4 -mt-16 mb-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-2xl border-3 border-white/40 overflow-hidden bg-slate-800 shadow-2xl">
            <img src={user.image || "/default-avatar.png"} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white">{user.name}</h1>

          <div className="px-4 text-amber-400 font-bold text-lg">
            {user.score.toLocaleString()} POINTS
          </div>
          
          {isOwnProfile && (
             <a href="/logout" className="mt-4 px-10 py-1 bg-red-800 text-white text-lg font-bold rounded-md">LOGOUT</a>
          )}
        </div>

        {/* Prediction History... */}
        <div className="mt-8">
          <div className="flex justify-between items-center border-white/10">
            <h3 className="text-white/50 font-bold uppercase">
            Prediction History
            </h3>
            <span className="text-xs text-white/30">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>
        
          <div className="grid gap-1">

            {currentItems.length > 0 ? (
              currentItems.map((pred: any) => (
                <div 
                  key={pred.id} 
                  className="pred-history-card"
                >
                  {/* แถวบน: Gameweek และสถานะ */}
                  <div className="header">
                    <span className="header-gw">
                      Gameweek {pred.gw}
                    </span>
                    {pred.fixture?.finished ? (
                      <span className="header-finished">
                        Finished
                      </span>
                    ):(
                      <span className="header-pending">
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

            {/* 4. ส่วนควบคุม Pagination (เลขหน้า 1, 2, 3) */}
            {totalPages > 1 && (
              <div className="mt-2 flex flex-wrap justify-center items-center gap-2">
                {/* ปุ่มย้อนกลับ */}
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/5 text-white disabled:opacity-20 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* ปุ่มเลขหน้า */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // แสดงเฉพาะหน้าใกล้เคียงถ้าจำนวนหน้าเยอะเกินไป (Logic พื้นฐาน)
                  if (
                      totalPages > 5 && 
                      pageNum !== 1 && 
                      pageNum !== totalPages && 
                      Math.abs(pageNum - currentPage) > 1
                  ) {
                      if (Math.abs(pageNum - currentPage) === 2) return <span key={pageNum} className="text-white/20">...</span>
                      return null
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-black text-sm transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#00ff85] text-[#38003c] shadow-[0_0_15px_rgba(0,255,133,0.4)]'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {/* ปุ่มไปข้างหน้า */}
                <button
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/5 text-white disabled:opacity-20 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}