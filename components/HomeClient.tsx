// components/HomeClient.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { getPredictActiveGW, isLiveGW, getFinishedGW, getCalculatedGW } from '@/app/actions/home'
import StatusTab from './StatusTab'
import PredictTab from './PredictTab'
import ScoreboardTab from './ScoreboardTab'
import UserProfileView from './UserProfileView' // import ตัวใหม่
import { getUserDetail } from '@/app/actions/user' // ต้อง export ฟังก์ชันนี้ใน actions ด้วย
import Link from 'next/link'

interface UserProfile {
  id: string;
  name: string;
  lineId: string;
  image: string | null;
  score: number;
}

export default function HomeClient({ user }: { user: UserProfile }) {
  const [activeTab, setActiveTab] = useState('fixture_tab')
  const [nextGW, setNextGW] = useState<number>(0)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  // ใช้ useRef เพื่อทำ Cache ข้ามการเปลี่ยน Tab
  const predictCache = useRef<Record<number, { fixtures: any[], predictions: any[], deadline: string | null }>>({})
  const scoreboardCache = useRef<any[] | null>(null)
  const statusCache = useRef<any | null>(null)

  useEffect(() => {
    const init = async () => {
      const gw = await getPredictActiveGW()
      setNextGW(gw)
    }
    init()
  }, [])

  // ฟังก์ชันเมื่อกดที่ชื่อ User (เช่น ในหน้า Scoreboard)
  const handleShowProfile = async (lineId: string) => {
    setIsProfileLoading(true)
    try {
      const user = await getUserDetail(lineId)
      setSelectedUser(user)
    } catch (err) {
      console.error("Error loading profile:", err)
    } finally {
      setIsProfileLoading(false)
    }
  }

  // หากมีการเลือก User ให้แสดง UserProfileView ทับทั้งหมด
  if (selectedUser) {
    return (
      <UserProfileView 
        user={selectedUser} 
        isOwnProfile={selectedUser.id === user.id} 
        onBack={() => setSelectedUser(null)} // กดกลับจะเคลียร์ค่าเพื่อกลับหน้า Tabs
      />
    )
  }

  // สีของพื้นหลังตามที่วาดไว้ในภาพร่าง
  const tabConfigs: any = {
    status_tab: { color: 'bg-[#38003c] text-white', label: 'Status' },
    fixture_tab: { color: 'bg-[#38003c] text-white', label: 'Fixture' },
    scoreboard_tab: { color: 'bg-[#38003c] text-white', label: 'Scoreboard' }
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="relative w-full h-[60px] overflow-hidden shadow-md bg-gradient-to-r from-[#f06272] via-[#9d50bb] to-[#6e48aa] flex items-center justify-between px-3">
        {/* 1. ส่วน Logo (EPL Predict) - อยู่ฝั่งซ้าย */}
        <div className="flex flex-col justify-center select-none">
          <h1 className="text-3xl font-black leading-none text-black tracking-tighter">
            EPL Predict
          </h1>
        </div>

        {/* 2. ส่วนข้อมูล User - อยู่ฝั่งขวา */}
        <div onClick={() => handleShowProfile(user.id)}>
          <div className="flex items-center gap-3">
            {user && ( // เพิ่มการเช็คว่ามี user หรือไม่
              <>
                <div className="flex flex-col items-end text-white drop-shadow-sm">
                  <span className="text-sm font-bold leading-none">
                    {user.name}
                  </span>
                  <span className="text-xs font-medium opacity-90">
                    Score: {user.score}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl border-2 border-white/50 overflow-hidden bg-white/20">
                  <img 
                    src={user.image || '/default-avatar.png'} 
                    className="w-full h-full object-cover" 
                    alt="profile" 
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isProfileLoading && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center text-white font-bold">
          Loading Profile...
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex bg-gray-200">
        {Object.keys(tabConfigs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 font-bold uppercase ${
              activeTab === tab ? tabConfigs[tab].color : 'text-gray-500'
            }`}
          >
            {tabConfigs[tab].label}
          </button>
        ))}
      </div>
      {/* เนื้อหาที่เปลี่ยนไปตาม Tab พร้อมสีพื้นหลัง */}
      <div className={`flex-1 ${tabConfigs[activeTab].color}`}>

        {/* ระหว่างรอโหลดค่า GW อาจจะใส่ Loading เล็กน้อย */}
        {activeTab === 'status_tab' && nextGW === 0 && (
          <div className="text-center py-10 text-white font-bold">Initializing Gameweek...</div>
        )}
        {activeTab === 'status_tab' && nextGW !== 0 && (
          <StatusTab nextGW={nextGW} onNavigate={() => setActiveTab('fixture_tab')} statusCache={statusCache} />
        )}

        {/* ระหว่างรอโหลดค่า GW อาจจะใส่ Loading เล็กน้อย */}
        {activeTab === 'fixture_tab' && nextGW === 0 && (
          <div className="text-center py-10 text-white font-bold">Initializing Gameweek...</div>
        )}
        {activeTab === 'fixture_tab' && nextGW !== 0 && (
          <PredictTab 
            userId={user.id} 
            nextGW={nextGW}
            predictCache={predictCache}
          />
        )}

        {activeTab === 'scoreboard_tab' && (
          <ScoreboardTab scoreboardCache={scoreboardCache} />
        )}
      </div>
    </div>
  )
}