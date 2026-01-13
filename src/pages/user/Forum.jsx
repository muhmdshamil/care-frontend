import { useEffect, useRef, useState } from 'react'
import { userService } from '../../services/user'
import Footer from '../../components/Footer'
import ReactMarkdown from 'react-markdown'

async function callAi(messages){
  const data = await userService.aiChat(messages)
  return data.reply || ''
}


export default function Forum() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to the MindCare Virtual Support. I’m here to listen and share supportive well-being tips. What’s on your mind today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const endRef = useRef(null)
  const userAvatar = typeof window !== 'undefined' ? localStorage.getItem('avatarUrl') : null
  const userInitial = 'U'

  const commonTopics = [
    {
      q: "How can I manage daily stress?",
      a: "Practicing mindfulness, maintaining a routine, and ensuring you get enough sleep are great first steps."
    },
    {
      q: "When should I see a professional?",
      a: "If your feelings are interfering with your daily life for more than two weeks, it's time to reach out."
    },
    {
      q: "Simple self-care ideas?",
      a: "Taking a short walk, staying hydrated, or practicing deep breathing can significantly boost your mood."
    },
    {
      q: "How to deal with anxiety?",
      a: "Grounding techniques like 5-4-3-2-1 or deep breathing can help in the moment."
    },
    {
      q: "Tips for better sleep?",
      a: "Maintaining a consistent schedule and avoiding screens before bed are key."
    },
    {
      q: "What is MindCare Hub?",
      a: "We are a comprehensive mental health platform offering support, resources, and connections to professionals."
    }
  ]

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const prevBg = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#f8fafc'
    return () => {
      document.body.style.backgroundColor = prevBg
    }
  }, [])

  const isRelatedTopic = (text) => {
    const keywords = ['stress', 'anxiety', 'depress', 'sad', 'lonely', 'sleep', 'insomnia', 'panic', 'worry', 'health', 'mindcare', 'well-being', 'support', 'help', 'feeling', 'emotion', 'hi', 'hello', 'hey']
    const t = text.toLowerCase()
    return keywords.some(k => t.includes(k)) || t.length < 5
  }

  const send = async (e, textOverride = null) => {
    if (e) e.preventDefault()
    const text = textOverride || input.trim()
    if (!text || (cooldown && !textOverride)) return

    if (!textOverride) setInput('')
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])

    if (!isRelatedTopic(text) && text.length > 20) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm here to support your mental health and well-being. Could you tell me more about how you're feeling or ask something related to MindCare Hub?" }])
      }, 500)
      return
    }

    setLoading(true)
    try {
      const reply = await callAi([...messages.slice(-3), userMsg])
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I am here to listen, though my connection is a bit slow. Please try again.' }])
    } finally {
      setLoading(false)
      setCooldown(true)
      setTimeout(()=>setCooldown(false), 800)
    }
  }

  const handleTopicClick = (topic) => {
    setInput(topic.q)
    // Small timeout to ensure input state is updated before send is called
    setTimeout(() => {
      const mockEvent = { preventDefault: () => {} }
      send(mockEvent, topic.q)
    }, 0)
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Forum Hero */}
      <div className="forum-hero fade-in">
        <style>{`
          @media(min-width: 1024px) {
            .forum-hero { height: 450px !important; }
          }
        `}</style>
        <img src="/images/banner/4.jpg" alt="Forum" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.75))' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ padding: '0 20px' }}>
            <h1 style={{ color: 'white', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '900', marginBottom: '16px', letterSpacing: '-0.03em', textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>MindCare Virtual Support</h1>
            <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto', fontWeight: 500 }}>A safe, quiet space to share your thoughts and find supportive professional guidance.</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5vw', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
        <div className="slide-up">
          <div style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
            <div style={{ padding: '32px 40px', borderBottom: '1px solid #f8fafc', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1a202c' }}>Well-being Guide</h3>
                  <div style={{ fontSize: '0.9rem', color: '#48bb78', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#48bb78' }}></span> Online Support
                  </div>
                </div>
              </div>
            </div>

            <div className="chat-box" style={{ height: '500px', background: '#fcfcfe', padding: '32px', overflowY: 'auto' }}>
              {messages.map((m, i) => (
                <div key={i} className={`chat-row ${m.role}`} style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    flexShrink: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: m.role === 'user' ? '#fff' : '#667eea',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: m.role === 'user' ? '1px solid #edf2f7' : 'none'
                  }}>
                    {m.role === 'user' ? (
                      userAvatar ? <img src={userAvatar} alt="me" /> : <span style={{ color: '#667eea', fontWeight: '800' }}>{userInitial}</span>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div style={{
                    maxWidth: '80%',
                    padding: '16px 20px',
                    borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: m.role === 'user' ? '#667eea' : 'white',
                    color: m.role === 'user' ? 'white' : '#2d3748',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    border: m.role === 'user' ? 'none' : '1px solid #edf2f7',
                    fontSize: '1rem',
                    lineHeight: '1.6'
                  }}>
                    {m.role === 'assistant' ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-row assistant" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <div style={{ background: 'white', padding: '16px 20px', borderRadius: '20px 20px 20px 4px', color: '#a0aec0', fontSize: '0.95rem', border: '1px solid #edf2f7' }}>Searching for guidance...</div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={send} style={{ padding: '32px', background: 'white', borderTop: '1px solid #f7fafc' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <input
                  value={input}
                  onChange={(e)=>setInput(e.target.value)}
                  placeholder="Tell us what’s on your mind today..."
                  style={{ flex: 1, padding: '16px 24px', borderRadius: '18px', border: '1px solid #edf2f7', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                />
                <button type="submit" className="btn pill purple" disabled={loading || !input.trim()} style={{ padding: '0 32px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', fontWeight: '700', boxShadow: '0 10px 15px -3px rgba(102, 126, 234, 0.4)' }}>Send</button>
              </div>
            </form>
          </div>
        </div>

        {/* Support Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="slide-up" style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #edf2f7', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
            <h4 style={{ margin: '0 0 20px', fontSize: '0.9rem', fontWeight: '800', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Popular Topics</h4>
            <div style={{ display: 'grid', gap: '14px' }}>
              {commonTopics.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTopicClick(topic)}
                  style={{
                    textAlign: 'left',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid #f7fafc',
                    background: '#fcfdfe',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    color: '#4a5568',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e)=>{
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseOut={(e)=>{
                    e.currentTarget.style.borderColor = '#f7fafc';
                    e.currentTarget.style.background = '#fcfdfe';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {topic.q}
                </button>
              ))}
            </div>
          </div>

          <div className="slide-up" style={{ background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)', borderRadius: '24px', padding: '32px', color: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '1.1rem', fontWeight: '700' }}>Immediate Help</h4>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px', opacity: 0.85 }}>If you are in a crisis, please remember you are not alone. Support is always available.</p>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '0.9rem' }}>
                <div style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '4px' }}>Emergency</div>
                <div style={{ fontWeight: '700' }}>Call 911 or local emergency</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '0.9rem' }}>
                <div style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '4px' }}>Crisis Text Line</div>
                <div style={{ fontWeight: '700' }}>Text HOME to 741741</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ height: '80px' }} />
      <Footer />
    </div>
  )
}

