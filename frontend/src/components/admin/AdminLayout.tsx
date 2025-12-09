import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom' 
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import ProductManagement from './ProductManagement'
import CustomerManagement from './CustomerManagement'
import OrderManagement from './OrderManagement'
import StockManagement from './StockManagement'

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation() 
  const getPageTitle = (path: string) => {
    if (path.includes('/products')) return 'QUẢN LÝ SẢN PHẨM'
    if (path.includes('/customers')) return 'QUẢN LÝ KHÁCH HÀNG'
    if (path.includes('/orders')) return 'QUẢN LÝ ĐƠN HÀNG'
    if (path.includes('/stock')) return 'NHẬP KHO'
    return 'DASHBOARD QUẢN TRỊ' 
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      
      <Sidebar isOpen={isSidebarOpen} />

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        background: '#f0f2f5', 
        color: '#2c3e50',
        transition: 'margin 0.3s ease'
      }}>
        
        <div style={{ 
          background: 'white', 
          padding: '15px 20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          position: 'sticky', 
          top: 0,
          zIndex: 100
        }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: 'transparent',
              border: '1px solid #ddd',
              color: '#333',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '4px',
              marginRight: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &#9776;
          </button>
          
          <h2 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            textTransform: 'uppercase'
          }}>
            {getPageTitle(location.pathname)}
          </h2>
        </div>

        <div className="admin-content-area" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/stock" element={<StockManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout