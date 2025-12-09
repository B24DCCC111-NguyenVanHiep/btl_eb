import React, { useEffect } from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice'

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const { stats, loading, error } = useAppSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (loading) return <div style={{ padding: '20px' }}>Đang tải số liệu thống kê...</div>
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Lỗi: {error}</div>

  return (
    <div>
      <p>Chào mừng bạn đến với hệ thống quản lý cửa hàng.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '30px' }}>

        <div style={{ padding: '20px', background: '#e6f7ff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Tổng sản phẩm</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff', margin: '10px 0' }}>
            {stats.totalProducts}
          </p>
        </div>

        <div style={{ padding: '20px', background: '#fffbe6', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Tổng khách hàng</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#faad14', margin: '10px 0' }}>
            {stats.totalCustomers}
          </p>
        </div>

        <div style={{ padding: '20px', background: '#f6ffed', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Tổng đơn hàng</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a', margin: '10px 0' }}>
            {stats.totalOrders}
          </p>
          <small>Đơn hoàn thành</small>
        </div>

        <div style={{ padding: '20px', background: '#fff0f6', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Doanh thu</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#eb2f96', margin: '10px 0' }}>
            {stats.revenue ? Number(stats.revenue).toLocaleString('vi-VN') : 0} ₫
          </p>
        </div>

        <div style={{ padding: '20px', background: '#f0f5ff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>Tổng tồn kho</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#2f54eb', margin: '10px 0' }}>
            {stats.totalStock}
          </p>
          <small>Sản phẩm trong kho</small>
        </div>
      </div>
    </div>
  )
}

export default Dashboard