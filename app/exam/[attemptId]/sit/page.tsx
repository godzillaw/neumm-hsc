import { requireAuth }      from '@/lib/auth-server'
import { loadAttemptConfig } from '../../mock-actions'
import MockTestSession        from '../../MockTestSession'


export default async function SitPage({
  params,
}: {
  params: { attemptId: string }
}) {
  await requireAuth()

  const result = await loadAttemptConfig(params.attemptId)

  if ('error' in result) {
    // Show the error instead of silently looping back
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F7F3FF', fontFamily:"'Nunito',sans-serif", padding:24 }}>
        <div style={{ background:'white', borderRadius:24, padding:32, maxWidth:400, width:'100%', textAlign:'center', boxShadow:'0 2px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
          <p style={{ fontWeight:900, fontSize:18, color:'#111', marginBottom:8 }}>Couldn&apos;t start test</p>
          <p style={{ fontSize:13, color:'#6B7280', marginBottom:24 }}>{result.error}</p>
          <a href="/math-nsw/app/exam" style={{ display:'inline-block', padding:'12px 24px', borderRadius:16, background:'linear-gradient(135deg,#7C3AED,#A855F7)', color:'white', fontWeight:900, fontSize:14, textDecoration:'none' }}>← Back to Exam</a>
        </div>
      </div>
    )
  }

  return (
    <MockTestSession
      attemptId={params.attemptId}
      config={result.config}
      questions={result.questions}
    />
  )
}
