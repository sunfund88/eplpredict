import { getLineLoginUrl } from '@/lib/line'

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <a
        href={getLineLoginUrl()}
        className="bg-green-500 text-white px-6 py-3 rounded-lg"
      >
        Login with LINE
      </a>
    </div>
  )
}
