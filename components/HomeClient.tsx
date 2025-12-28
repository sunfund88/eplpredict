// components/HomeClient.tsx
'use client'
import { useState, useEffect } from 'react'
import { getPredictActiveGW } from '@/app/actions/home'
import ResultTab from './ResultTab'
import PredictTab from './PredictTab'

export default function HomeClient({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState('predict')
  const [nextGW, setNextGW] = useState<number>(0)

  useEffect(() => {
    const init = async () => {
      const activeGW = await getPredictActiveGW()
      setNextGW(activeGW)
    }
    init()
  }, [])

  // สีของพื้นหลังตามที่วาดไว้ในภาพร่าง
  const tabConfigs: any = {
    result: { color: 'bg-[#38003c]', label: 'Result' },
    predict: { color: 'bg-yellow-400', label: 'Predict' },
    leaderboard: { color: 'bg-red-500', label: 'Scoreboard' }
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
        {activeTab === 'result' && (
          <ResultTab />
        )}
        
        {/* แก้ไขตรงนี้: เพิ่มเช็ค nextGW !== 0 */}
        {activeTab === 'predict' && nextGW !== 0 && (
          <PredictTab userId={userId} nextGW={nextGW}/>
        )}

        {/* ระหว่างรอโหลดค่า GW อาจจะใส่ Loading เล็กน้อย */}
        {activeTab === 'predict' && nextGW === 0 && (
          <div className="text-center py-10 text-purple-900 font-bold">Initializing Gameweek...</div>
        )}

        {activeTab === 'leaderboard' && <div>{/* วนลูปโชว์อันดับ */}</div>}
      </div>
    </div>
  )
}