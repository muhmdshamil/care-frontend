import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userService } from '../../services/user'
import { adminService } from '../../services/admin'
import { professionalService } from '../../services/professional'
import { shopService } from '../../services/shop'
import { useAuth } from '../../context/AuthContext'
import AuthLayout from '../../components/AuthLayout'

export default function UserLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
      return JSON.parse(jsonPayload)
    } catch {
      return null
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Email and password are required')
    try {
      setLoading(true)
      // Try user -> professional -> admin
      let data
      try {
        data = await userService.login({ email, password })
      } catch (e1) {
        try {
          data = await professionalService.login({ email, password })
        } catch (e2) {
          try {
            data = await shopService.login({ email, password })
          } catch (e3) {
            data = await adminService.login({ email, password })
          }
        }
      }
      const role = parseJwt(data.token)?.role || 'USER'
      login(data.token, role)
      if (role === 'ADMIN') navigate('/admin/dashboard')
      else if (role === 'PROFESSIONAL') navigate('/professional/dashboard')
      else if (role === 'SHOP_OWNER') navigate('/shop/dashboard')
      else navigate('/user/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      image={"/images/banner/5.jpg"}
      heading="Welcome Back!"
      subheading="To keep connected with us please login with your personal info"
      ctaLabel="Create Account"
      onCta={() => navigate('/register')}
    >
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Sign in</h2>
        <div className="muted" style={{ marginTop: 6, fontSize: 14 }}>Access your MindCare Hub account</div>
      </div>

      {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

      <div style={{ height: 1, background: '#eee', margin: '10px 0 18px' }} />

      <form onSubmit={onSubmit} className="form" style={{ display: 'grid', gap: 12 }}>
        <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
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
        <button type="submit" className="btn pill purple" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div style={{ textAlign: 'center', fontSize: 14 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
