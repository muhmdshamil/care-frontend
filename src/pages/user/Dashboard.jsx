import { useEffect, useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Carousel from '../../components/Carousel'
import { userService } from '../../services/user'
import Footer from '../../components/Footer'

export default function UserDashboard() {
  const [user, setUser] = useState(null)
  const [notifs, setNotifs] = useState([])
  const [showNotifs, setShowNotifs] = useState(true)
  const [pros, setPros] = useState([])
  const [toolResults, setToolResults] = useState([])
  const [loading, setLoading] = useState(true)

  const HERO_IMAGES = [
    '/images/banner/2.webp',
    '/images/banner/5.jpg',
    '/images/banner/7.jpg'
  ]

  useEffect(() => {
    let mounted = true
    const dismissed = typeof window !== 'undefined' ? localStorage.getItem('hideAppointmentNotifs') === '1' : false
    
    setLoading(true)
    Promise.all([
      userService.me(),
      userService.appointmentNotifications(),
      userService.listProfessionalsPublic(),
      userService.myToolResults()
    ]).then(([userData, notifData, proData, toolData]) => {
      if (!mounted) return
      setUser(userData)
      if (notifData.notifications && notifData.notifications.length && !dismissed) {
        setNotifs(notifData.notifications)
      }
      setPros(proData || [])
      setToolResults(toolData || [])
    }).catch(err => {
      console.error("Dashboard fetch error:", err)
    }).finally(() => {
      if (mounted) setLoading(false)
    })

    return () => { mounted = false }
  }, [])

  const latestResult = toolResults[0]
  
  const groupedTrend = useMemo(() => {
    const raw = toolResults.reduce((acc, r) => {
      (acc[r.type] ||= []).push(r)
      return acc
    }, {})
    Object.keys(raw).forEach(k => raw[k].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)))
    return raw
  }, [toolResults])

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="center">
        <div style={{ fontSize: '3rem' }}>🧘</div>
        <p className="muted" style={{ marginTop: 10 }}>Preparing your wellness hub...</p>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Old Style Hero Carousel */}
      <section className="hero">
        <div className="hero-bg-carousel">
          <Carousel images={HERO_IMAGES} />
        </div>
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-text fade-in">
            <div className="kicker" style={{ color: '#d1d5db', fontWeight: 800 }}>MindCare Doc</div>
            <h1 style={{ color: '#fff' }}>FOR A HAPPIER LIFE AHEAD</h1>
            <p style={{ color: '#e5e7eb' }}>
              Welcome back, {user?.name?.split(' ')[0]}. Your personalized sanctuary for mental clarity and clinical progress.
            </p>
            <div className="cta">
              <Link to="/user/tools" className="btn pill purple">New Assessment</Link>
              <Link to="/user/appointment" className="btn pill outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Book Session</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Layout Hub (Clinical Data) */}
      <div style={{ maxWidth: 1400, margin: '-60px auto 60px', padding: '0 5vw', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '30px' }}>
          
          {/* Notifications Card */}
          {notifs.length > 0 && showNotifs && (
            <div className="premium-card slide-up" style={{ 
              background: 'linear-gradient(135deg, #fdfcfb 0%, #eef2ff 100%)',
              border: '2px solid #e0e7ff',
              padding: '30px',
              borderRadius: '32px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e1b4b', fontWeight: 800 }}>Appointments Update</h3>
                <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 700 }}>Dismiss</button>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {notifs.map(n => (
                  <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.9rem' }}>{n.service}</div>
                      <div className="muted" style={{ fontSize: '0.8rem' }}>{n.date} at {n.time}</div>
                    </div>
                    <div style={{ background: '#f5f3ff', color: '#6366f1', padding: '4px 12px', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', height: 'fit-content' }}>
                      Token #{n.tokenNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Trend Widget */}
          <div className="premium-card slide-up" style={{ background: 'white', padding: '30px', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
            <h3 style={{ margin: '0 0 8px', fontWeight: 800 }}>Wellness Progress</h3>
            <p className="muted" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>Visualizing your recent assessment scores.</p>
            {toolResults.length < 2 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '24px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📈</div>
                <p className="muted" style={{ fontSize: '0.9rem' }}>Keep completing assessments to unlock your trend analysis.</p>
              </div>
            ) : (
              Object.keys(groupedTrend).map(type => (
                <div key={type} style={{ marginBottom: '20px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#1e1b4b' }}>{type} Trend</strong>
                      <span style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 800 }}>{groupedTrend[type][groupedTrend[type].length - 1].score} Today</span>
                   </div>
                   <div style={{ height: '100px' }}>
                      <TrendChart data={groupedTrend[type]} max={type === 'PHQ-9' ? 27 : 21} />
                   </div>
                </div>
              ))
            )}
          </div>

          {/* Latest Result Card */}
          <div className="premium-card slide-up" style={{ background: 'white', padding: '30px', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
            <h3 style={{ margin: '0 0 20px', fontWeight: 800 }}>Latest Assessment</h3>
            {latestResult ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: '#6366f1' }}>
                    {latestResult.score}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b' }}>{latestResult.type} Score</div>
                    <div className="muted" style={{ fontSize: '0.85rem' }}>Completed {new Date(latestResult.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <Link to="/user/tools" className="btn outline pill" style={{ width: '100%', fontSize: '0.85rem' }}>View History</Link>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p className="muted">No assessments yet. Start your first check-in today.</p>
                <Link to="/user/tools" className="btn purple pill" style={{ marginTop: '10px' }}>Start Assessment</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Section (Restored) */}
      <section className="section" id="about" style={{ background: '#fff', padding: '100px 5vw' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="about-grid">
            <div className="fade-in">
              <div className="kicker">About MindCare</div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '24px' }}>Compassionate Care for Your Mental Well-being</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569', marginBottom: '32px' }}>
                At MindCare Hub, we believe that everyone deserves access to quality mental health support. Our platform is designed to provide a safe, confidential, and supportive environment for your personal growth and healing.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                <div>
                   <h4 style={{ margin: '0 0 8px', color: '#1e1b4b' }}>Expert Professionals</h4>
                   <p className="muted" style={{ fontSize: '0.9rem' }}>Connect with licensed clinical psychologists and therapists.</p>
                </div>
                <div>
                   <h4 style={{ margin: '0 0 8px', color: '#1e1b4b' }}>Secure & Private</h4>
                   <p className="muted" style={{ fontSize: '0.9rem' }}>Your data and sessions are protected by enterprise-grade encryption.</p>
                </div>
              </div>
              <Link to="/user/professionals" className="btn purple pill">Meet Our Specialists</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <img src="/images/mind/m1.jpg" alt="About MindCare" className="about-img" style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} />
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#312e81', color: '#fff', padding: '24px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>10+</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 700, textTransform: 'uppercase' }}>Expert Doctors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section (Restored Old Design) */}
      <section className="section" id="specialties" style={{ background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="center" style={{ marginBottom: '48px' }}>
            <div className="kicker">Our Specialties</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>How We Can Help You</h2>
            <p className="muted" style={{ maxWidth: 600, margin: '16px auto 0' }}>We provide specialized support for a wide range of mental health challenges, tailored to your unique journey.</p>
          </div>
          
          <div className="issues-grid">
            {[
              { title: 'Anxiety Disorder', img: '/images/disorder/anxiety.webp', desc: 'Managing persistent worry and panic through evidence-based coping.' },
              { title: 'Depression', img: '/images/disorder/depression.webp', desc: 'Supportive care to help you navigate through low moods and interest.' },
              { title: 'Self-Esteem Issues', img: '/images/disorder/self.jpg', desc: 'Building confidence and a positive self-image through therapy.' },
              { title: 'Sleep & Insomnia', img: '/images/disorder/sleep.webp', desc: 'Addressing the root causes of sleep disturbances for better rest.' },
              { title: 'Anger Issues', img: '/images/disorder/anger.webp', desc: 'Learning to manage and express anger in healthy, constructive ways.' },
              { title: 'Teen-age Problems', img: '/images/disorder/teenage.webp', desc: 'Specialized support for adolescents navigating complex changes.' },
              { title: 'Children Problems', img: '/images/disorder/children.webp', desc: 'Compassionate therapy for behavioral challenges in children.' },
              { title: 'Pregnancy Stress', img: '/images/disorder/preg.jpeg', desc: 'Support for emotional well-being during and after pregnancy.' }
            ].map((s, i) => (
              <div key={i} className="issue-card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <img src={s.img} alt={s.title} className="issue-img" />
                <h5 style={{ fontWeight: 800, color: '#111827' }}>{s.title}</h5>
                <p className="muted" style={{ fontSize: '0.8rem', lineHeight: 1.4, marginTop: 4 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="center" style={{ marginTop: '48px' }}>
            <Link to="/user/counselling-info" className="btn pill outline" style={{ color: '#312e81', borderColor: '#312e81' }}>View All Treatments</Link>
          </div>
        </div>
      </section>

      {/* Blog/Insights Section (New) */}
      <section className="section" style={{ background: '#fff', padding: '100px 5vw' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <div className="kicker">Mental Wellness</div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>MindCare Insights</h2>
            </div>
            <Link to="/user/blog" style={{ fontWeight: 800, color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Read All Blogs <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '40px' }}>
            {[
              {
                title: "The Power of Mindfulness in Daily Life",
                videoUrl: "https://www.youtube.com/embed/w6T02g5hnT4",
                category: "Mindfulness",
                desc: "Discover how spending just 10 minutes a day in mindful meditation can rewire your brain for happiness and calm."
              },
              {
                title: "Understanding Stress: The Mind-Body Connection",
                videoUrl: "https://www.youtube.com/embed/g0S_Z59n4to",
                category: "Mental Health",
                desc: "Stress isn't just in your head. It affects your entire physical well-being. Learn how to identify and manage it effectively."
              }
            ].map((blog, i) => (
              <div key={i} className="premium-card fade-in" style={{ padding: 0, overflow: 'hidden', borderRadius: '32px' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: '#000' }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={blog.videoUrl} 
                    title={blog.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
                <div style={{ padding: '30px' }}>
                  <span style={{ background: '#f5f3ff', color: '#6366f1', padding: '6px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '16px', display: 'inline-block' }}>
                    {blog.category}
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: '#111827' }}>{blog.title}</h3>
                  <p className="muted" style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>{blog.desc}</p>
                  <Link to="/user/blog" className="btn pill purple" style={{ fontSize: '0.9rem', padding: '10px 24px' }}>Read More</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Team Carousel (Kept New) */}
      <section className="section" style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
             <div>
               <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '12px' }}>Your Care Team</h2>
               <p className="muted" style={{ fontSize: '1.1rem' }}>Connect with world-class specialists matched to your needs.</p>
             </div>
             <Link to="/user/professionals" style={{ fontWeight: 800, color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
               View All <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </Link>
          </div>

          <div className="pro-carousel-wrapper" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <style>{`
              @keyframes scroll {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
              }
              .pro-track {
                display: flex;
                gap: 24px;
                width: max-content;
                animation: scroll 40s linear infinite;
              }
              .pro-track:hover { animation-play-state: paused; }
              .pro-card-mini {
                flex: 0 0 300px;
                background: #f8fafc;
                border: 1px solid #f1f5f9;
                border-radius: 32px;
                padding: 30px;
                text-align: center;
                transition: all 0.4s ease;
              }
              .pro-card-mini:hover { background: #fff; box-shadow: 0 20px 40px rgba(99, 102, 241, 0.08); transform: translateY(-8px); border-color: #e0e7ff; }
            `}</style>
            
            <div className="pro-track">
              {[...pros, ...pros, ...pros].map((p, idx) => (
                <div key={idx} className="pro-card-mini">
                  <div style={{ 
                    width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 16px',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.8rem', fontWeight: 900
                  }}>
                     {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : p.name[0]}
                  </div>
                  <h4 style={{ marginBottom: '6px', fontSize: '1.1rem', fontWeight: 800 }}>{p.name}</h4>
                  <p className="muted" style={{ fontSize: '0.8rem', marginBottom: '20px', minHeight: '32px' }}>{p.bio?.slice(0, 60)}...</p>
                  <Link to="/user/appointment" state={{ doctorName: p.name }} className="btn pill purple" style={{ width: '100%', fontSize: '0.8rem', padding: '10px 0', border: 'none' }}>Consult</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Support (Integration) */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="premium-card" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', padding: '40px', borderRadius: '32px' }}>
            <h3 style={{ margin: '0 0 12px', fontWeight: 800 }}>Need Someone to Talk To?</h3>
            <p style={{ opacity: 0.9, marginBottom: '24px', lineHeight: 1.6 }}>Our Virtual Well-being Guide is available 24/7 to listen and provide supportive insights in a safe, quiet space.</p>
            <Link to="/user/forum" className="btn pill" style={{ background: 'white', color: '#6366f1', border: 'none', padding: '14px 28px' }}>Enter Support Chat</Link>
          </div>
          <div className="premium-card" style={{ background: '#1e1b4b', color: 'white', padding: '40px', borderRadius: '32px' }}>
            <h3 style={{ margin: '0 0 12px', fontWeight: 800 }}>Confidential Counselling</h3>
            <p style={{ opacity: 0.9, marginBottom: '24px', lineHeight: 1.6 }}>Secure online therapy sessions with licensed clinical psychologists from the comfort of your home.</p>
            <Link to="/user/counselling-info" className="btn pill outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', padding: '14px 28px' }}>Online Therapy Info</Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

function TrendChart({ data, max }) {
  if (!data || data.length < 2) return null
  const width = 400, height = 100, padding = 10
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - ((d.score / max) * (height - padding * 2) + padding)
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M ${points} L ${width - padding},${height} L ${padding},${height} Z`} fill="url(#trendGrad)" />
      <polyline fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding
        const y = height - ((d.score / max) * (height - padding * 2) + padding)
        return <circle key={i} cx={x} cy={y} r="3" fill="white" stroke="#6366f1" strokeWidth="2" />
      })}
    </svg>
  )
}

// removed legacy scroll helper; track uses native scroll
