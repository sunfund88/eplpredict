import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('line_user')

  if (!userCookie) redirect('/')

  const user = JSON.parse(userCookie.value)

  return (
    <div style={{ padding: 40 }}>
      <img
        src={user.picture}
        width={120}
        height={120}
        style={{ borderRadius: '50%' }}
      />
      <h1>สวัสดี {user.name}</h1>
      <p>LINE ID: {user.id}</p>
    </div>
  )
}
