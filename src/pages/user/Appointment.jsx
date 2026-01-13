import { useEffect, useState } from 'react'
import { userService } from '../../services/user'
import Footer from '../../components/Footer'
import { useLocation } from 'react-router-dom'

export default function Appointment() {
  const location = useLocation()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [doctor, setDoctor] = useState(location.state?.doctorName || '')
  const [message, setMessage] = useState('')
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState('')

  useEffect(() => {
    userService.listProfessionalsPublic().then(setDoctors)
  }, [])

  const dayKey = (ds) => {
    if (!ds) return null
    const d = new Date(ds)
    const map = ['sun','mon','tue','wed','thu','fri','sat']
    return map[d.getDay()]
  }

  const selectedDoctor = doctors.find(d => d.name === doctor) || null
  const slots = (() => {
    const key = dayKey(date)
    if (!key || !selectedDoctor || !selectedDoctor.availability) return []
    const arr = selectedDoctor.availability[key]
    return Array.isArray(arr) ? arr : []
  })()

  const slotsForUI = selectedDoctor ? slots : []

  useEffect(() => {
    if (!slotsForUI.includes(time)) setTime('')
  }, [doctor, date, slotsForUI, time])

  const onSubmit = async (e) => {
    e.preventDefault()
    setInfo('')
    const name = `${firstName} ${lastName}`.trim()
    if (!doctor) {
      setInfo('Please choose a specialist.')
      return
    }
    if (date && slotsForUI.length === 0) {
      setInfo('No slots for the selected date. Please pick another date.')
      return
    }
    if (!time) {
      setInfo('Please select a preferred time slot.')
      return
    }
    try {
      setLoading(true)
      await userService.bookAppointment({
        name,
        phone,
        email,
        service: doctor || 'General',
        date,
        time,
        notes: message,
        professionalId: selectedDoctor ? selectedDoctor.id : null,
      })
      setInfo('Your appointment has been successfully requested. We will contact you shortly.')
      setFirstName('')
      setLastName('')
      setPhone('')
      setEmail('')
      setDate('')
      setTime('')
      setDoctor('')
      setMessage('')
    } catch (e) {
      setInfo(e.response?.data?.error || 'Failed to submit booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Premium Hero Section */}
      <div style={{
        position: 'relative',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8%',
        background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white'
      }}>
        <div className="fade-in" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.02em' }}>Book Your Healing Journey</h1>
          <p style={{ fontSize: '1.25rem', opacity: '0.9', lineHeight: '1.6', maxWidth: '600px' }}>
            Connect with world-class mental health professionals in a secure, supportive environment. Your well-being is our priority.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-60px auto 40px', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          
          {/* Booking Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
            border: '1px solid #edf2f7'
          }} className="slide-up">
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px', color: '#1a202c' }}>Appointment Details</h2>
            <p style={{ color: '#718096', marginBottom: '40px' }}>Please fill in the details below to schedule your session.</p>

            {info && (
              <div style={{
                padding: '16px 20px',
                borderRadius: '12px',
                background: info.includes('success') ? '#f0fdf4' : '#fef2f2',
                color: info.includes('success') ? '#166534' : '#991b1b',
                marginBottom: '24px',
                fontSize: '0.95rem',
                border: info.includes('success') ? '1px solid #bbf7d0' : '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                {info}
              </div>
            )}

            <form onSubmit={onSubmit} style={{ display: 'grid', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>First Name</label>
                  <input style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="e.g. John" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>Last Name</label>
                  <input style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem' }} value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="e.g. Doe" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>Phone Number</label>
                  <input style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem' }} value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+1 (555) 000-0000" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>Email Address</label>
                  <input type="email" style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem' }} value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="john@example.com" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>Preferred Date</label>
                  <input type="date" style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem' }} value={date} onChange={(e)=>setDate(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>Select Specialist</label>
                  <select style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', appearance: 'none', background: 'white url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a0aec0\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center' }} value={doctor} onChange={(e)=>setDoctor(e.target.value)} required>
                    <option value="">Choose a Provider</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>Available Time Slots</label>
                {!date || !doctor ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: '#f7fafc', borderRadius: '12px', color: '#a0aec0', fontSize: '0.95rem', border: '1px dashed #e2e8f0' }}>
                    Select a date and specialist to view available times
                  </div>
                ) : slotsForUI.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: '#fff5f5', borderRadius: '12px', color: '#e53e3e', fontSize: '0.95rem' }}>
                    No slots found for this date.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                    {slotsForUI.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '10px',
                          border: time === t ? '2px solid #5a67d8' : '1px solid #e2e8f0',
                          background: time === t ? '#ebf4ff' : 'white',
                          color: time === t ? '#434190' : '#4a5568',
                          fontWeight: time === t ? '700' : '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          fontSize: '0.9rem'
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#4a5568' }}>Additional Notes</label>
                <textarea rows={4} style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', resize: 'vertical' }} value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Please tell us about your requirements..." />
              </div>

              <button
                type="submit"
                disabled={loading || !time}
                style={{
                  marginTop: '12px',
                  padding: '18px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #4c51bf 0%, #667eea 100%)',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: (loading || !time) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(76, 81, 191, 0.3)',
                  transition: 'transform 0.2s',
                  opacity: (loading || !time) ? 0.7 : 1
                }}
                onMouseOver={(e) => !loading && time && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {loading ? 'Processing...' : 'Schedule Appointment'}
              </button>
            </form>
          </div>

          {/* Info Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Specialist Profile Quick Access */}
            {selectedDoctor && (
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                border: '1px solid #edf2f7',
                textAlign: 'center'
              }} className="fade-in">
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f0f4ff', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '700', color: '#5a67d8', border: '4px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  {selectedDoctor.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>Dr. {selectedDoctor.name}</h3>
                <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '24px' }}>Mental Health Specialist</p>
                
                <div style={{ textAlign: 'left', display: 'grid', gap: '16px' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#a0aec0', letterSpacing: '0.1em', fontWeight: '800' }}>Weekly Availability</h4>
                  {['mon','tue','wed','thu','fri','sat','sun'].map(dk => {
                    const hasSlots = Array.isArray(selectedDoctor.availability?.[dk]) && selectedDoctor.availability[dk].length > 0;
                    return (
                      <div key={dk} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f7fafc' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: hasSlots ? '#4a5568' : '#cbd5e1', textTransform: 'capitalize' }}>{dk}</span>
                        <span style={{ fontSize: '0.85rem', color: hasSlots ? '#5a67d8' : '#cbd5e1', fontWeight: hasSlots ? '600' : '400' }}>
                          {hasSlots ? `${selectedDoctor.availability[dk][0]} - ${selectedDoctor.availability[dk][selectedDoctor.availability[dk].length-1]}` : 'Closed'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Clinic Contact */}
            <div style={{
              background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
              borderRadius: '24px',
              padding: '32px',
              color: 'white',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '24px' }}>Fast Support</h3>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>Phone Support</div>
                    <div style={{ fontWeight: '600' }}>+1 (555) 123-4567</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>Our Location</div>
                    <div style={{ fontWeight: '600' }}>123 Wellness Ave, Suite 200</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>Office Hours</div>
                    <div style={{ fontWeight: '600' }}>Mon – Fri, 9:00 – 18:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Message */}
            <div style={{
              background: '#ebf4ff',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid #c3dafe',
              color: '#434190'
            }}>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                <strong>Need immediate assistance?</strong> If you are in a crisis, please call emergency services or visit the nearest hospital immediately.
              </p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

