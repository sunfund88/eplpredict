export default function Home() {
  return (
    <main style={{display:'flex',height:'100vh',justifyContent:'center',alignItems:'center'}}>
      <a
        href="/api/auth/line/"
        style={{
          background:'#06C755',
          color:'#fff',
          padding:'14px 24px',
          borderRadius:8,
          fontWeight:'bold'
        }}
      >
        Login with LINE
      </a>
    </main>
  )
}
