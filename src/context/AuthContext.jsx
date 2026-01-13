import { createContext, useContext, useMemo, useState, useEffect } from 'react'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [role, setRole] = useState(() => localStorage.getItem('role'))

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
      return JSON.parse(jsonPayload)
    } catch (e) {
      return null
    }
  }

  const login = (newToken, roleName) => {
    setToken(newToken)
    localStorage.setItem('token', newToken)
    const payload = parseJwt(newToken)
    const derived = payload?.role || roleName || null
    if (derived) {
      setRole(derived)
      localStorage.setItem('role', derived)
    }
  }

  useEffect(() => {
    if (token && !role) {
      const payload = parseJwt(token)
      const derived = payload?.role || null
      if (derived) {
        setRole(derived)
        localStorage.setItem('role', derived)
      }
    }
  }, [token, role])

  const logout = () => {
    setToken(null)
    setRole(null)
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  const value = useMemo(() => ({ token, role, login, logout }), [token, role])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
