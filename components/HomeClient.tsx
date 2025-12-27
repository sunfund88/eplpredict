// components/HomeClient.tsx
'use client'
import { useState } from 'react'
import ResultTab from './ResultTab'

export default function HomeClient({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState('predict')

  // สีของพื้นหลังตามที่วาดไว้ในภาพร่าง
  const tabConfigs: any = {
    result: { color: 'bg-pink-400', label: 'Result' },
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
      <div className={`flex-1 p-4 ${tabConfigs[activeTab].color}`}>
        {activeTab === 'result' && (
          <ResultTab />
        )}
        {activeTab === 'predict' && <div>{/* วนลูปโชว์ฟอร์มทายผล */}</div>}
        {activeTab === 'leaderboard' && <div>{/* วนลูปโชว์อันดับ */}</div>}
      </div>
    </div>
  )
}