import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setMessage('Mật khẩu nhập lại không khớp!')
      return
    }

    try {
      await api.post('/auth/register', { 
        username: formData.username, 
        password: formData.password 
      })
      alert('Tạo tài khoản Admin thành công!')
      navigate('/login')
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Đăng ký thất bại')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Đăng ký Quản trị</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{fontWeight: 'bold'}}>Tên đăng nhập</label>
          <input 
            type="text" 
            placeholder="Nhập username" 
            value={formData.username} 
            onChange={e => setFormData({...formData, username: e.target.value})} 
            required 
            style={{ width: '100%', padding: '12px', marginTop: '5px' }} 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{fontWeight: 'bold'}}>Mật khẩu</label>
          <input 
            type="password" 
            placeholder="Nhập mật khẩu" 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            required 
            style={{ width: '100%', padding: '12px', marginTop: '5px' }} 
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{fontWeight: 'bold'}}>Nhập lại mật khẩu</label>
          <input 
            type="password" 
            placeholder="Xác nhận mật khẩu" 
            value={formData.confirmPassword} 
            onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
            required 
            style={{ width: '100%', padding: '12px', marginTop: '5px' }} 
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
          ĐĂNG KÝ
        </button>
      </form>
      
      {message && <p style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>{message}</p>}
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Đã có tài khoản? <Link to="/login" style={{ color: '#3498db', fontWeight: 'bold' }}>Đăng nhập ngay</Link>
      </p>
    </div>
  )
}

export default Register