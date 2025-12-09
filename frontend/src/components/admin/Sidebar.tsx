import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'

interface SidebarProps {
  isOpen: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div style={{
      width: isOpen ? '250px' : '0px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      padding: isOpen ? '20px' : '0px',
      opacity: isOpen ? 1 : 0,
      whiteSpace: 'nowrap',
      background: '#001529',
      color: 'white',
      minHeight: '100vh',
      flexShrink: 0
    }}>
      <h2 style={{ color: 'white', marginBottom: '30px', textAlign: 'center' }}>Quản lý cửa hàng</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '15px' }}>
          <Link to="/admin/" style={{ color: 'white', display: 'block', padding: '10px' }}>Dashboard</Link>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <Link to="/admin/products" style={{ color: 'white', display: 'block', padding: '10px' }}>Sản phẩm</Link>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <Link to="/admin/customers" style={{ color: 'white', display: 'block', padding: '10px' }}>Khách hàng</Link>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <Link to="/admin/orders" style={{ color: 'white', display: 'block', padding: '10px' }}>Đơn hàng</Link>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <Link to="/admin/stock" style={{ color: 'white', display: 'block', padding: '10px' }}>Nhập kho</Link>
        </li>
        <li style={{ marginBottom: '15px', borderTop: '1px solid #333', paddingTop: '15px' }}>
          <button onClick={handleLogout} style={{ background: '#e74c3c', width: '100%', border: 'none', color: 'white', cursor: 'pointer', padding: '10px', borderRadius: '4px' }}>
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar