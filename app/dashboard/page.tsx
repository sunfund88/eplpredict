import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get('line_token')

  if (!token) {
    redirect('/')
  }

  return <h1>Dashboard</h1>
}

