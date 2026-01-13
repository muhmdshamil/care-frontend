import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userService } from '../../services/user'
import AuthLayout from '../../components/AuthLayout'

export default function UserRegister() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    if (password !== confirmPassword) {
      setMsg('Passwords do not match')
      return
    }
    try {
      await userService.register({ name, email, password, confirmPassword })
      setMsg('Registered. You can login now.')
      setTimeout(()=>navigate('/login'), 800)
    } catch (e) {
      setMsg(e.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <AuthLayout
      image={"/images/banner/6.jpg"}
      heading="Create your account"
      subheading="Join MindCare Hub for supportive tools, community chat, and appointments."
      ctaLabel="Sign In"
      onCta={() => navigate('/login')}
    >
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Create Account</h2>
        <div className="muted" style={{ marginTop: 6, fontSize: 14 }}>Start your well-being journey</div>
      </div>

      {msg && <div className="info" style={{ marginBottom: 12 }}>{msg}</div>}

      <div style={{ height: 1, background: '#eee', margin: '10px 0 18px' }} />

      <form onSubmit={onSubmit} className="form" style={{ display: 'grid', gap: 12 }}>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" required />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
          />
          <button type="button" onClick={()=>setShowPassword(s=>!s)} style={{ padding: '0 12px', border: '1px solid #ddd', borderRadius: 8, background: '#f8f8f8' }}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Confirm Password" required minLength={6} />
        <button type="submit" className="btn pill purple" style={{ width: '100%' }}>Sign Up</button>
      </form>
    </AuthLayout>
  )
}
