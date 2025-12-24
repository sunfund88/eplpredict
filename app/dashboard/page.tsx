import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Dashboard() {
  const token = cookies().get('line_token')
  if (!token) redirect('/')

  return <h1>Dashboard</h1>
}
