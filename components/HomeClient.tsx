// components/HomeClient.tsx
'use client'
import { useState, useEffect } from 'react'
import { getPredictActiveGW, isLiveGW, getFinishedGW, getCalculatedGW } from '@/app/actions/home'
import StatusTab from './StatusTab'
import PredictTab from './PredictTab'
import ScoreboardTab from './ScoreboardTab'

export default function HomeClient({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState('fixture_tab')
  const [nextGW, setNextGW] = useState<number>(0)

  useEffect(() => {
    const init = async () => {
      setNextGW(await getPredictActiveGW())
    }
    init()
  }, [])

  // สีของพื้นหลังตามที่วาดไว้ในภาพร่าง
  const tabConfigs: any = {
    status_tab: { color: 'bg-[#38003c] text-white', label: 'Status' },
    fixture_tab: { color: 'bg-[#38003c] text-white', label: 'Fixture' },
    leaderboard: { color: 'bg-[#38003c] text-white', label: 'Scoreboard' }
  }

  return (
    <div className="flex flex-col flex-1">
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
          <StatusTab nextGW={nextGW} onNavigate={() => setActiveTab('fixture_tab')} />
        )}

        {/* ระหว่างรอโหลดค่า GW อาจจะใส่ Loading เล็กน้อย */}
        {activeTab === 'fixture_tab' && nextGW === 0 && (
          <div className="text-center py-10 text-white font-bold">Initializing Gameweek...</div>
        )}
        {activeTab === 'fixture_tab' && nextGW !== 0 && (
          <PredictTab userId={userId} nextGW={nextGW}/>
        )}

        {activeTab === 'leaderboard' && (
          <ScoreboardTab/>
        )}
      </div>
    </div>
  )
}