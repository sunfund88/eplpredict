import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')
  if (!userId) redirect('/')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">ยินดีต้อนรับ 🎉</h1>
      <p>คุณเข้าสู่ระบบด้วย LINE แล้ว</p>
    </div>
  )
}
