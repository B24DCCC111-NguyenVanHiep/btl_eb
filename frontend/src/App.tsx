import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './hooks/useAppSelector'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import AdminLayout from './components/admin/AdminLayout'

function App() {
  const { user } = useAppSelector(state => state.auth)
  const isAuthenticated = !!user

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {isAuthenticated ? (
          <Route path="/admin/*" element={<AdminLayout />} />
        ) : null}

        <Route path="*" element={<Navigate to={isAuthenticated ? "/admin" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App