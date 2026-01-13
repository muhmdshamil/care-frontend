import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AdminDashboard from './pages/admin/Dashboard'
import AdminContentManager from './pages/admin/ContentManager'
import ProDashboard from './pages/professional/Dashboard'
import UserRegister from './pages/user/Register'
import UserLogin from './pages/user/Login'
import UserDashboard from './pages/user/Dashboard'
import UserTools from './pages/user/Tools'
import UserContent from './pages/user/Content'
import UserProfile from './pages/user/Profile'
import Appointment from './pages/user/Appointment'
import Forum from './pages/user/Forum'
import OnlineCounselling from './pages/user/OnlineCounselling'
import UserBlog from './pages/user/Blog'
import Professionals from './pages/user/Professionals'
import Shops from './pages/user/Shops'
import ShopDetails from './pages/user/ShopDetails'
import ShopOwnerDashboard from './pages/shop/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import UserHeader from './components/UserHeader'
import AdminHeader from './components/AdminHeader'
import ProHeader from './components/ProHeader'
import ShopHeader from './components/ShopHeader'
import Contact from './pages/Contact'

export default function App() {
  const location = useLocation()
  const path = location.pathname
  const isAuth = (
    path === '/login' || path === '/register'
  )
  let HeaderComponent = UserHeader
  if (path.startsWith('/admin')) HeaderComponent = AdminHeader
  else if (path.startsWith('/professional')) HeaderComponent = ProHeader
  else if (path.startsWith('/shop')) HeaderComponent = ShopHeader

  if (isAuth) {
    return (
      <div className="auth-page">
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          {null}
        </Routes>
      </div>
    )
  }

  return (
    <div className="container">
      <HeaderComponent />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminContentManager />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/professional/dashboard"
          element={
            <ProtectedRoute roles={["PROFESSIONAL"]}>
              <ProDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shop/dashboard"
          element={
            <ProtectedRoute roles={["SHOP_OWNER"]}>
              <ShopOwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute roles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/tools"
          element={
            <ProtectedRoute roles={["USER"]}>
              <UserTools />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/content"
          element={
            <ProtectedRoute roles={["USER"]}>
              <UserContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/forum"
          element={
            <ProtectedRoute roles={["USER"]}>
              <Forum />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute roles={["USER"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/blog"
          element={
            <ProtectedRoute roles={["USER"]}>
              <UserBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/professionals"
          element={
            <ProtectedRoute roles={["USER"]}>
              <Professionals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/shops"
          element={
            <ProtectedRoute roles={["USER"]}>
              <Shops />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/shops/:id"
          element={
            <ProtectedRoute roles={["USER"]}>
              <ShopDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/counselling-info"
          element={
            <ProtectedRoute roles={["USER"]}>
              <OnlineCounselling />
            </ProtectedRoute>
          }
        />
        <Route path="/user/appointment" element={<Appointment />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function Home() {
  const { token, role } = useAuth()
  let to = '/login'
  if (token) {
    if (role === 'USER') to = '/user/dashboard'
    else if (role === 'PROFESSIONAL') to = '/professional/dashboard'
    else if (role === 'ADMIN') to = '/admin/dashboard'
    else if (role === 'SHOP_OWNER') to = '/shop/dashboard'
  }
  return <Navigate to={to} replace />
}
