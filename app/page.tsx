import { getLineLoginUrl } from '@/lib/line'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06C755]">
      <a
        href={getLineLoginUrl()}
        className="bg-white text-[#06C755] px-8 py-4 rounded-xl font-bold text-lg shadow"
      >
        Login with LINE
      </a>
    </main>
  )
}
