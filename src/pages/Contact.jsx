import { useState } from 'react'
import { professionalService } from '../services/professional'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('')
    try {
      setLoading(true)
      await professionalService.createContactMessage({ name, email, phone, subject, message })
      setStatus('Thanks! We\'ll get back to you soon.')
      setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('')
      setTimeout(() => setStatus(''), 5000)
    } catch (e) {
      setStatus('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Icons
  const MapPin = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  const Phone = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v2a2 2 0 0 1-2.18 2c-3.06-.26-6-1.64-8.24-3.88A19.79 19.79 0 0 1 5.2 8.18 2 2 0 0 1 7.2 6h2a2 2 0 0 1 2 1.72c.12.86.34 1.69.66 2.48a2 2 0 0 1-.45 2.11l-.7.7a16 16 0 0 0 6.9 6.9l.7-.7a2 2 0 0 1 2.11-.45c.79.32 1.62.54 2.48.66A2 2 0 0 1 22 16.92z"/></svg>
  const Mail = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  const Globe = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>

  return (
    <>
      <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 3.5fr) 6.5fr',
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          width: '100%',
          maxWidth: 1100,
          minHeight: 600
        }}>
          
          {/* Left Sidebar */}
          <div style={{
            background: '#0f172a',
            color: '#ffffff',
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', bottom: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 1 }} />
            <div style={{ position: 'absolute', bottom: 40, right: -80, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 1 }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: 12 }}>Contact Information</h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: 40 }}>
                Get in touch with us. We're here to assist you with any questions or support you need.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <MapPin />
                  <span style={{ fontSize: '0.95rem' }}>123 Wellness Ave, Suite 200,<br />MindCity, MC 10101</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Mail />
                  <span style={{ fontSize: '0.95rem' }}>support@mindcare.dev</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Phone />
                  <span style={{ fontSize: '0.95rem' }}>+1 (555) 123-4567</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Globe />
                  <span style={{ fontSize: '0.95rem' }}>www.mindcaredoc.com</span>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 2, marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{width: 6, height: 6, borderRadius: '50%', background: '#4ade80'}}></div>
                <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Support: Mon–Fri | 9:00 AM – 6:00 PM</span>
              </div>
              <Link to="/user/appointment" className="btn" style={{ 
                background: '#ffffff', color: '#0f172a', border: 'none', 
                borderRadius: 30, padding: '12px 24px', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 8 
              }}>
                Book Appointment
              </Link>
            </div>
          </div>

          {/* Right Form */}
          <div style={{ padding: '40px 50px', display: 'flex', flexDirection: 'column' }}>
            {status && (
              <div style={{ 
                padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: '0.9rem',
                background: status.includes('Thanks') ? '#f0fdf4' : '#fef2f2',
                color: status.includes('Thanks') ? '#166534' : '#b91c1c'
              }}>
                {status}
              </div>
            )}
            
            <style>{`
              .contact-input {
                width: 100%;
                border: none;
                border-bottom: 1px solid #cbd5e1;
                padding: 12px 0;
                border-radius: 0;
                outline: none;
                background: transparent;
                font-size: 1rem;
                transition: border-color 0.3s ease, box-shadow 0.3s ease;
                color: #1e293b;
              }
              .contact-input:focus {
                border-bottom-color: #0f172a;
                box-shadow: 0 1px 0 0 #0f172a;
              }
              .contact-label {
                display: block;
                font-size: 0.85rem;
                font-weight: 600;
                color: #64748b;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              }
            `}</style>
            
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 40px', marginBottom: 40 }}>
                <div>
                  <label className="contact-label">Your Name</label>
                  <input 
                    className="contact-input"
                    value={name} onChange={(e)=>setName(e.target.value)} required 
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="contact-label">Phone Number</label>
                  <input 
                     className="contact-input"
                     value={phone} onChange={(e)=>setPhone(e.target.value)}
                     placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="contact-label">Email Address</label>
                  <input 
                     className="contact-input"
                     type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required
                     placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="contact-label">Subject</label>
                  <input 
                     className="contact-input"
                     value={subject} onChange={(e)=>setSubject(e.target.value)} required
                     placeholder="Inquiry about services"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 40, flex: 1 }}>
                <label className="contact-label">Message</label>
                <textarea 
                   className="contact-input"
                   rows={4} value={message} onChange={(e)=>setMessage(e.target.value)} required 
                   placeholder="Tell us how we can help..."
                   style={{ resize: 'none' }}
                />
              </div>

              <div style={{ textAlign: 'right', marginTop: 'auto' }}>
                 <button 
                   type="submit" 
                   disabled={loading}
                   style={{ 
                     background: '#0f172a', color: '#fff', border: 'none', borderRadius: 999, 
                     padding: '14px 40px', fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                     opacity: loading ? 0.8 : 1,
                     boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                     transition: 'transform 0.2s'
                   }}
                   onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                   onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                 >
                   {loading ? 'Sending...' : 'Send Message'}
                 </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Mobile styling overrides */}
        <style>{`
          @media (max-width: 800px) {
            .section > div { grid-template-columns: 1fr !important; height: auto !important; }
            .section > div > div:first-child { padding: 32px 24px !important; }
            .section > div > div:last-child { padding: 32px 24px !important; }
            form > div:first-child { grid-template-columns: 1fr !important; gap: 24px !important; }
          }
        `}</style>
      </div>
      <Footer />
    </>
  )
}
