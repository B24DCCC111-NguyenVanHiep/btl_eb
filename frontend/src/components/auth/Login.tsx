import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { login } from '../../redux/slices/authSlice'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useAppSelector(state => state.auth)

  useEffect(() => {
    if (user) {
      navigate('/admin')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        navigate('/admin')
      })
      .catch((err) => console.error(err))
  }

  return (
    <div className="container" style={{
      maxWidth: '420px', margin: '80px auto', padding: '40px 30px',
      background: 'white', borderRadius: '16px', boxShadow: '0 15px 40px rgba(0,0,0,0.12)', textAlign: 'center'
    }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Hệ thống quản lý</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Đăng nhập để tiếp tục</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Tên đăng nhập</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '25px', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '16px', background: loading ? '#95a5a6' : '#3498db',
            color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: loading ? 'wait' : 'pointer'
          }}
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '20px', padding: '15px', borderRadius: '10px', background: '#fadbd8', color: '#e74c3c', fontWeight: 'bold' }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Chưa có tài khoản quản trị?</p>
        <button 
          type="button"
          onClick={() => navigate('/register')}
          style={{
            width: '100%', 
            padding: '12px', 
            background: 'white', 
            color: '#2c3e50', 
            border: '2px solid #ecf0f1', 
            borderRadius: '10px', 
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          Tạo tài khoản Admin mới
        </button>
      </div>
    </div>
  )
}

export default Login