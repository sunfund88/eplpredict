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
      <h1>Welcome 🎉</h1>
      <img
        src={user.pictureUrl}
        alt="profile"
        width={120}
        style={{ borderRadius: '50%' }}
      />
      <h2>{user.displayName}</h2>
      <p>User ID: {user.userId}</p>
      <form action="/dashboard/logout" method="POST">
        <button
          type="submit"
          style={{
            marginTop: 20,
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </form>
    </div>
  )
}
