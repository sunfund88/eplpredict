import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('line_user')

  if (!userCookie) {
    redirect('/')
  }

  const user = JSON.parse(userCookie.value)

  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome 🎉 ADMIN</h1>
    </div>
  )
}
