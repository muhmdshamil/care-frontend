import { useEffect, useState, useMemo } from 'react'
import { userService } from '../../services/user'
import Footer from '../../components/Footer'

const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading or watching television',
  'Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead or of hurting yourself in some way',
]

const GAD7_QUESTIONS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
]

const INTERPRETATIONS = {
  'PHQ-9': (score) => {
    if (score <= 4) return { label: 'Minimal', color: '#10b981', desc: 'Typical of normal emotional variations. Continue with your healthy routine.' }
    if (score <= 9) return { label: 'Mild', color: '#f59e0b', desc: 'Suggests some depressive symptoms. Monitor your mood and practice self-care.' }
    if (score <= 14) return { label: 'Moderate', color: '#f97316', desc: 'Could be a sign of clinical depression. We recommend speaking with a specialist.' }
    if (score <= 19) return { label: 'Moderately Severe', color: '#ef4444', desc: 'Strong signs of depression. Please prioritize professional consultation.' }
    return { label: 'Severe', color: '#7f1d1d', desc: 'Indicates high distress. Please seek professional help immediately.' }
  },
  'GAD-7': (score) => {
    if (score <= 4) return { label: 'Minimal', color: '#10b981', desc: 'Few anxiety symptoms present. Stay mindful of your stressors.' }
    if (score <= 9) return { label: 'Mild', color: '#f59e0b', desc: 'Suggestive of low-level anxiety. Regular meditation or exercise might help.' }
    if (score <= 14) return { label: 'Moderate', color: '#f97316', desc: 'Moderate anxiety detected. Counseling could provide helpful coping strategies.' }
    return { label: 'Severe', color: '#ef4444', desc: 'High levels of anxiety. Professional assessment is highly recommended.' }
  }
}

export default function Tools() {
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard | selection | assessment | result
  const [selectedTool, setSelectedTool] = useState(null)
  const [currentAnswers, setCurrentAnswers] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastSavedResult, setLastSavedResult] = useState(null)

  const loadHistory = async () => {
    try {
      const data = await userService.myToolResults()
      setResults(data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { loadHistory() }, [])

  const startTool = (toolName) => {
    setSelectedTool(toolName)
    setCurrentAnswers(toolName === 'PHQ-9' ? Array(9).fill(null) : Array(7).fill(null))
    setActiveTab('assessment')
  }

  const handleAnswer = (idx, val) => {
    const next = [...currentAnswers]
    next[idx] = val
    setCurrentAnswers(next)
  }

  const calculateScore = () => currentAnswers.reduce((a, b) => a + (b || 0), 0)

  const saveResult = async () => {
    if (currentAnswers.includes(null)) {
      alert("Please answer all questions before submitting.")
      return
    }
    setLoading(true)
    const score = calculateScore()
    try {
      const res = await userService.saveToolResult({
        type: selectedTool,
        score: score,
        data: { answers: currentAnswers }
      })
      setLastSavedResult(res)
      setActiveTab('result')
      loadHistory()
    } catch (err) {
      alert("Failed to save result. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const groupedTrend = useMemo(() => {
    const raw = results.reduce((acc, r) => {
      (acc[r.type] ||= []).push(r)
      return acc
    }, {})
    Object.keys(raw).forEach(k => raw[k].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)))
    return raw
  }, [results])

  const renderDashboard = () => (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
        <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #edf2f7' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#1e293b', fontWeight: 800 }}>Mental Health Tracking</h2>
          <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '32px' }}>
            Use our clinically validated tools to keep a pulse on your emotional well-being. Regular check-ins help identify patterns and guide your journey to balance.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('selection')} className="btn purple pill" style={{ padding: '14px 28px' }}>New Assessment</button>
            <button onClick={() => loadHistory()} className="btn outline pill" style={{ padding: '14px 28px', color: '#475569', borderColor: '#e2e8f0' }}>Refresh Data</button>
          </div>
        </div>

        <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #edf2f7' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>At a Glance</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {Object.keys(groupedTrend).length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#cbd5e1', fontStyle: 'italic' }}>
                No assessments taken yet.
              </div>
            ) : (
              Object.keys(groupedTrend).map(k => {
                const latest = groupedTrend[k][groupedTrend[k].length - 1]
                const interpret = INTERPRETATIONS[k]?.(latest.score)
                return (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1e293b' }}>{k}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Latest: {interpret?.label || 'Result'}</div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: interpret?.color || '#4f46e5' }}>{latest.score}</div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #edf2f7', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '24px' }}>Trend Analysis</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {Object.keys(groupedTrend).map(type => (
            <div key={type} style={{ padding: '20px', border: '1px solid #f1f5f9', borderRadius: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                 <strong style={{ color: '#475569' }}>{type} Progress</strong>
                 <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{groupedTrend[type].length} tests</span>
              </div>
              <div style={{ height: '120px', position: 'relative' }}>
                <TrendChart data={groupedTrend[type]} max={type === 'PHQ-9' ? 27 : 21} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSelection = () => (
    <div className="fade-in" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => setActiveTab('dashboard')} style={{ marginBottom: '24px', background: 'none', border: 'none', color: '#4f46e5', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ← Back to Dashboard
      </button>
      <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '12px' }}>Choose an Assessment</h1>
      <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '48px' }}>Select the tool that best fits your current needs.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div onClick={() => startTool('PHQ-9')} className="tool-card-hover" style={{ cursor: 'pointer', background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #edf2f7', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'left' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', marginBottom: '24px' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px' }}>PHQ-9</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>Validated tool for screening, diagnosing, and monitoring the severity of depression.</p>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4f46e5' }}>9 QUESTIONS • 2 MINS</div>
        </div>

        <div onClick={() => startTool('GAD-7')} className="tool-card-hover" style={{ cursor: 'pointer', background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #edf2f7', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'left' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '24px' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px' }}>GAD-7</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>A self-report questionnaire for screening and severity measuring of generalized anxiety disorder.</p>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>7 QUESTIONS • 2 MINS</div>
        </div>
      </div>
    </div>
  )

  const renderAssessment = () => {
    const questions = selectedTool === 'PHQ-9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS
    const progress = (currentAnswers.filter(x => x !== null).length / questions.length) * 100

    return (
      <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{selectedTool} Assessment</h2>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>{Math.round(progress)}% Complete</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#4f46e5', transition: 'width 0.4s ease' }}></div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '32px' }}>
          {questions.map((q, i) => (
            <div key={i} style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #edf2f7', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '24px', color: '#1e293b', lineHeight: '1.5' }}>
                <span style={{ color: '#4f46e5', marginRight: '8px' }}>{i + 1}.</span> {q}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {['Not at all', 'Several days', 'More than half the days', 'Nearly every day'].map((label, val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(i, val)}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '12px',
                      border: currentAnswers[i] === val ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                      background: currentAnswers[i] === val ? '#ebf4ff' : 'white',
                      color: currentAnswers[i] === val ? '#1e1b4b' : '#64748b',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                      lineHeight: '1.2'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '48px', display: 'flex', gap: '20px', paddingBottom: '100px' }}>
          <button onClick={() => setActiveTab('selection')} className="btn outline pill" style={{ flex: 1, padding: '18px' }}>Cancel</button>
          <button
            onClick={saveResult}
            disabled={loading || currentAnswers.includes(null)}
            className="btn purple pill"
            style={{ flex: 2, padding: '18px', fontWeight: '700', fontSize: '1.1rem' }}
          >
            {loading ? 'Processing...' : 'Submit Assessment'}
          </button>
        </div>
      </div>
    )
  }

  const renderResult = () => {
    if (!lastSavedResult) return null
    const interpret = INTERPRETATIONS[lastSavedResult.type](lastSavedResult.score)

    return (
      <div className="fade-in" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: 'white', padding: '60px 40px', borderRadius: '32px', border: '1px solid #edf2f7', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f0fdf4', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Assessment Complete</h1>
          <p style={{ color: '#64748b', marginBottom: '40px' }}>Your responses have been recorded and analyzed.</p>

          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 32px' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              <circle cx="18" cy="18" r="16" fill="none" stroke={interpret.color} strokeWidth="3" strokeDasharray={`${(lastSavedResult.score / (lastSavedResult.type === 'PHQ-9' ? 27 : 21)) * 100}, 100`} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '3rem', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>{lastSavedResult.score}</span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700', marginTop: '4px' }}>TOTAL SCORE</span>
            </div>
          </div>

          <div style={{ padding: '24px', borderRadius: '20px', background: `${interpret.color}10`, border: `1px solid ${interpret.color}30`, marginBottom: '40px' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: interpret.color, marginBottom: '8px' }}>{interpret.label} Severity</h2>
             <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>{interpret.desc}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <button onClick={() => setActiveTab('dashboard')} className="btn purple pill" style={{ padding: '16px' }}>Return to Dashboard</button>
            <button onClick={() => window.location.href = '/appointments'} className="btn outline pill" style={{ padding: '16px' }}>Book Appointment</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 5vw 0' }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'selection' && renderSelection()}
        {activeTab === 'assessment' && renderAssessment()}
        {activeTab === 'result' && renderResult()}
      </div>
      <Footer />

      <style>{`
        .tool-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          border-color: #6366f1 !important;
        }
      `}</style>
    </div>
  )
}

function TrendChart({ data, max }) {
  if (!data || data.length < 2) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: '0.85rem' }}>
        Wait for more assessments to see trends
      </div>
    )
  }

  const width = 400
  const height = 120
  const padding = 10
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - ((d.score / max) * (height - padding * 2) + padding)
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M ${points} L ${width - padding},${height} L ${padding},${height} Z`}
        fill="url(#lineGrad)"
      />
      <polyline
        fill="none"
        stroke="#4f46e5"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding
        const y = height - ((d.score / max) * (height - padding * 2) + padding)
        return <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#4f46e5" strokeWidth="2" />
      })}
    </svg>
  )
}

