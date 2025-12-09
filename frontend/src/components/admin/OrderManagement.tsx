// import React, { useEffect, useState } from 'react'
// import { useAppDispatch } from '../../hooks/useAppDispatch'
// import { useAppSelector } from '../../hooks/useAppSelector'
// import { fetchOrders, createOrder } from '../../redux/slices/orderSlice'
// import { fetchProducts } from '../../redux/slices/productSlice'
// import { fetchCustomers } from '../../redux/slices/customerSlice'
// import api from '../../services/api'

// const OrderManagement: React.FC = () => {
//   const dispatch = useAppDispatch()
//   const { orders, loading: ordersLoading } = useAppSelector(state => state.orders)
//   const { products, loading: productsLoading } = useAppSelector(state => state.products)
//   const { customers, loading: customersLoading } = useAppSelector(state => state.customers)

//   const [selectedCustomer, setSelectedCustomer] = useState(0)
//   const [orderItems, setOrderItems] = useState<{ product_id: number; quantity: number }[]>([])
//   const [selectedProduct, setSelectedProduct] = useState(0)
//   const [quantity, setQuantity] = useState(1)
//   const [searchTerm, setSearchTerm] = useState('')

//   useEffect(() => {
//     dispatch(fetchOrders())
//     dispatch(fetchProducts())
//     dispatch(fetchCustomers())
//   }, [dispatch])

//   const handleStatusChange = async (orderId: number, newStatus: string) => {
//     try {
//       await api.put(`/orders/${orderId}/status`, { status: newStatus })
//       alert('Cập nhật trạng thái đơn hàng thành công!')
//       dispatch(fetchOrders())
//     } catch (err: any) {
//       alert(`Lỗi: ${err.response?.data?.message || 'Không thể cập nhật trạng thái'}`)
//     }
//   }

//   const handleAddItem = () => {
//     if (selectedProduct && quantity > 0) {
//       const product = products.find(p => p.id === selectedProduct)
//       if (product && quantity <= product.stock) {
//         setOrderItems(prev => {
//           const existing = prev.find(i => i.product_id === selectedProduct)
//           if (existing) {
//             return prev.map(i => i.product_id === selectedProduct ? { ...i, quantity: i.quantity + quantity } : i)
//           }
//           return [...prev, { product_id: selectedProduct, quantity }]
//         })
//         setSelectedProduct(0)
//         setQuantity(1)
//       } else {
//         alert('Số lượng vượt quá tồn kho!')
//       }
//     }
//   }

//   const handleRemoveItem = (index: number) => {
//     setOrderItems(prev => prev.filter((_, i) => i !== index))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (selectedCustomer && orderItems.length > 0) {
//       dispatch(createOrder({ customer_id: selectedCustomer, items: orderItems }))
//         .unwrap()
//         .then(() => {
//           setSelectedCustomer(0)
//           setOrderItems([])
//           setSelectedProduct(0)
//           setQuantity(1)
//           alert('Tạo đơn hàng thành công!')
//         })
//         .catch((err) => alert(err))
//     }
//   }

//   const filteredOrders = orders.filter(o =>
//     o.order_code.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const loading = ordersLoading || productsLoading || customersLoading

//   return (
//     <div className="container" style={{ padding: '30px 0', color: '#2c3e50' }}>
      
//       <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
//         <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Tạo đơn hàng mới</h2>

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: '25px' }}>
//             <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Khách hàng:</label>
//             <select
//               value={selectedCustomer}
//               onChange={(e) => setSelectedCustomer(Number(e.target.value))}
//               required
//               style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
//             >
//               <option value={0}>-- Chọn khách hàng --</option>
//               {customers.map(c => (
//                 <option key={c.id} value={c.id}>
//                   {c.full_name} ({c.code})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={{ marginBottom: '25px' }}>
//             <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Thêm sản phẩm:</label>
//             <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
//               <select
//                 value={selectedProduct}
//                 onChange={(e) => setSelectedProduct(Number(e.target.value))}
//                 style={{ flex: 1, minWidth: '320px', padding: '14px', borderRadius: '8px', border: '1px solid #ddd' }}
//               >
//                 <option value={0}>-- Chọn sản phẩm --</option>
//                 {products
//                   .filter(p => p.visible && p.stock > 0)
//                   .map(p => (
//                     <option key={p.id} value={p.id}>
//                       {p.name} (Tồn: {p.stock} - Giá: {p.price.toLocaleString()}₫)
//                     </option>
//                   ))}
//               </select>
//               <input
//                 type="number"
//                 min="1"
//                 value={quantity}
//                 onChange={(e) => setQuantity(Number(e.target.value))}
//                 style={{ width: '100px', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}
//               />

//               <button
//                 type="button"
//                 onClick={handleAddItem}
//                 disabled={!selectedProduct || quantity <= 0}
//                 style={{
//                   padding: '14px 28px',
//                   background: (selectedProduct && quantity > 0) ? '#3498db' : '#ccc',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '8px',
//                   fontWeight: 'bold',
//                   cursor: (selectedProduct && quantity > 0) ? 'pointer' : 'not-allowed'
//                 }}
//               >
//                 Thêm vào đơn
//               </button>
//             </div>
//           </div>

//           {orderItems.length > 0 && (
//             <div style={{ marginBottom: '30px' }}>
//               <h3 style={{ margin: '0 0 15px 0' }}>Sản phẩm trong đơn hàng ({orderItems.length})</h3>
//               <table style={{ width: '100%', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderCollapse: 'collapse' }}>
//                 <thead style={{ background: '#34495e', color: 'white' }}>
//                   <tr>
//                     <th style={{ padding: '14px', textAlign: 'left' }}>Sản phẩm</th>
//                     <th style={{ padding: '14px', textAlign: 'center' }}>Số lượng</th>
//                     <th style={{ padding: '14px', textAlign: 'center' }}>Giá</th>
//                     <th style={{ padding: '14px', textAlign: 'center' }}>Thành tiền</th>
//                     <th style={{ padding: '14px' }}></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orderItems.map((item, index) => {
//                     const prod = products.find(p => p.id === item.product_id)
//                     const total = prod ? prod.price * item.quantity : 0
//                     return (
//                       <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
//                         <td style={{ padding: '14px' }}>{prod?.name || 'Không tìm thấy'}</td>
//                         <td style={{ padding: '14px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</td>
//                         <td style={{ padding: '14px', textAlign: 'center' }}>{prod?.price.toLocaleString()}₫</td>
//                         <td style={{ padding: '14px', textAlign: 'center', color: '#e74c3c', fontWeight: 'bold' }}>
//                           {total.toLocaleString()}₫
//                         </td>
//                         <td style={{ padding: '14px', textAlign: 'center' }}>
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveItem(index)}
//                             style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
//                           >
//                             Xóa
//                           </button>
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={!selectedCustomer || orderItems.length === 0}
//             style={{
//               width: '100%',
//               padding: '18px',
//               fontSize: '20px',
//               fontWeight: 'bold',
//               background: selectedCustomer && orderItems.length > 0 ? '#27ae60' : '#95a5a6',
//               color: 'white',
//               border: 'none',
//               borderRadius: '12px',
//               cursor: selectedCustomer && orderItems.length > 0 ? 'pointer' : 'not-allowed',
//               boxShadow: '0 6px 20px rgba(39,174,96,0.3)'
//             }}
//           >
//             TẠO ĐƠN HÀNG NGAY
//           </button>
//         </form>
//       </div>

//       <input
//         type="text"
//         placeholder="Tìm kiếm theo mã đơn..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         style={{
//           width: '100%',
//           padding: '16px',
//           marginBottom: '25px',
//           borderRadius: '12px',
//           border: '1px solid #ddd',
//           fontSize: '16px',
//           background: 'white'
//         }}
//       />

//       {loading ? (
//         <p>Đang tải dữ liệu...</p>
//       ) : filteredOrders.length === 0 ? (
//         <p>Không có đơn hàng nào.</p>
//       ) : (
//         <div style={{ overflowX: 'auto' }}>
//           <table style={{ width: '100%', background: 'white', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', borderCollapse: 'collapse', overflow: 'hidden' }}>
//             <thead style={{ background: '#2c3e50', color: 'white' }}>
//               <tr>
//                 <th style={{ padding: '16px', textAlign: 'left' }}>Mã đơn</th>
//                 <th style={{ padding: '16px', textAlign: 'left' }}>Khách hàng</th>
//                 <th style={{ padding: '16px', textAlign: 'left' }}>Thời gian</th>
//                 <th style={{ padding: '16px', textAlign: 'left' }}>Tổng tiền</th>
//                 <th style={{ padding: '16px', textAlign: 'center' }}>Trạng thái</th>
//                 <th style={{ padding: '16px', textAlign: 'center' }}>Hành động</th>
//               </tr>
//             </thead>
//             <tbody style={{ color: '#333' }}>
//               {filteredOrders.map(o => {
//                 const cust = customers.find(c => c.id === o.customer_id)
//                 return (
//                   <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
//                     <td style={{ padding: '16px' }}>
//                       <strong style={{ color: '#3498db' }}>{o.order_code}</strong>
//                     </td>
//                     <td style={{ padding: '16px' }}>{cust?.full_name || (o as any).customer_name || 'Khách lẻ'}</td>
//                     <td style={{ padding: '16px' }}>
//                       {new Date(o.purchase_time).toLocaleString('vi-VN')}
//                     </td>
//                     <td style={{ padding: '16px', fontWeight: 'bold', color: '#e74c3c' }}>
//                       {Number(o.total_amount).toLocaleString()}₫
//                     </td>
//                     <td style={{ padding: '16px', textAlign: 'center' }}>
//                       <span style={{
//                         padding: '8px 16px',
//                         borderRadius: '20px',
//                         fontSize: '14px',
//                         background: o.status === 'completed' ? '#d5f5e3' : (o.status === 'cancelled' ? '#fadbd8' : '#fff3cd'),
//                         color: o.status === 'completed' ? '#27ae60' : (o.status === 'cancelled' ? '#e74c3c' : '#f39c12'),
//                         fontWeight: 'bold'
//                       }}>
//                         {o.status === 'completed' ? 'Hoàn thành' : (o.status === 'cancelled' ? 'Đã hủy' : 'Chờ xử lý')}
//                       </span>
//                     </td>
//                     <td style={{ padding: '16px', textAlign: 'center' }}>
//                       <select
//                         value={o.status}
//                         onChange={(e) => handleStatusChange(o.id, e.target.value)}
//                         style={{
//                           padding: '8px',
//                           borderRadius: '6px',
//                           border: '1px solid #ddd',
//                           cursor: 'pointer',
//                           fontWeight: '500'
//                         }}
//                       >
//                         <option value="pending">Chờ xử lý</option>
//                         <option value="completed">Duyệt (Hoàn thành)</option>
//                         <option value="cancelled">Hủy đơn</option>
//                       </select>
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   )
// }

// export default OrderManagement













// src/components/admin/OrderManagement.tsx
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchOrders, createOrder } from '../../redux/slices/orderSlice'
import { fetchProducts } from '../../redux/slices/productSlice'
import { fetchCustomers } from '../../redux/slices/customerSlice'
import api from '../../services/api'

interface OrderItemDetail {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  stock: number
}

interface OrderDetail {
  id: number
  order_code: string
  customer_id: number
  customer_name: string
  customer_phone: string
  customer_address: string
  purchase_time: string
  total_amount: number
  status: 'pending' | 'completed' | 'cancelled'
  items: OrderItemDetail[]
}

const OrderManagement: React.FC = () => {
  const dispatch = useAppDispatch()
  const { orders, loading: ordersLoading } = useAppSelector(state => state.orders)
  const { products, loading: productsLoading } = useAppSelector(state => state.products)
  const { customers, loading: customersLoading } = useAppSelector(state => state.customers)

  const [selectedCustomer, setSelectedCustomer] = useState<number>(0)
  const [orderItems, setOrderItems] = useState<{ product_id: number; quantity: number }[]>([])
  const [selectedProduct, setSelectedProduct] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState<boolean>(false)

  // Edit mode
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)
  const [status, setStatus] = useState<'pending' | 'completed' | 'cancelled'>('pending')

  useEffect(() => {
    dispatch(fetchOrders(''))
    dispatch(fetchProducts())
    dispatch(fetchCustomers())
  }, [dispatch])

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(fetchOrders(searchTerm.trim()))
    }, 350)
    return () => clearTimeout(t)
  }, [searchTerm, dispatch])

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return
    const product = products.find(p => p.id === selectedProduct)
    if (!product || quantity > product.stock) return alert('Số lượng vượt quá tồn kho!')

    setOrderItems(prev => {
      const existing = prev.find(i => i.product_id === selectedProduct)
      if (existing) {
        return prev.map(i => i.product_id === selectedProduct ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, { product_id: selectedProduct, quantity }]
    })
    setSelectedProduct(0)
    setQuantity(1)
  }

  const handleRemoveItem = (index: number) => setOrderItems(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer || orderItems.length === 0) return

    try {
      if (isEditing && editingOrderId) {
        // Gửi dữ liệu lên backend, backend xử lý trừ / cộng kho theo trạng thái
        await api.put(`/orders/${editingOrderId}`, {
          customer_id: selectedCustomer,
          items: orderItems,
          status
        })
        alert('Cập nhật đơn hàng thành công!')
      } else {
        // Gửi kèm status khi tạo mới
        await dispatch(createOrder({ customer_id: selectedCustomer, items: orderItems, status })).unwrap()
        alert('Tạo đơn hàng thành công!')
      }
      handleCancelEdit()
      dispatch(fetchOrders(searchTerm))
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert('Lỗi lưu đơn hàng')
      }
    }
  }

  const openDetail = async (orderId: number) => {
    try {
      setDetailLoading(true)
      const res = await api.get<OrderDetail>(`/orders/${orderId}`)
      setSelectedOrder(res.data)
    } catch {
      alert('Lỗi tải chi tiết đơn hàng')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleEdit = async (orderId: number) => {
    try {
      setDetailLoading(true)
      const res = await api.get<OrderDetail>(`/orders/${orderId}`)
      const order = res.data
      setSelectedCustomer(order.customer_id)
      setOrderItems(order.items.map(i => ({ product_id: i.product_id, quantity: i.quantity })))
      setStatus(order.status)
      setIsEditing(true)
      setEditingOrderId(order.id)
    } catch {
      alert('Lỗi tải đơn hàng để sửa')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingOrderId(null)
    setSelectedCustomer(0)
    setOrderItems([])
    setSelectedProduct(0)
    setQuantity(1)
    setStatus('pending')
  }

  const handleStatusChange = async (orderId: number, newStatus: 'pending' | 'completed' | 'cancelled') => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus })
      dispatch(fetchOrders(searchTerm))
    } catch {
      alert('Không thể cập nhật trạng thái')
    }
  }

  const loading = ordersLoading || productsLoading || customersLoading || detailLoading

  const filteredOrders = orders.filter(o => {
    const cust = customers.find(c => c.id === o.customer_id)
    const custName = cust?.full_name.toLowerCase() || ''
    const productNames = (o.items as OrderItemDetail[] | undefined)?.map(i => i.product_name.toLowerCase()).join(' ') || ''
    const term = searchTerm.toLowerCase()
    return o.order_code.toLowerCase().includes(term) || custName.includes(term) || productNames.includes(term)
  })

  return (
    <div className="container" style={{ padding: 30 }}>
      {/* FORM TẠO / SỬA ĐƠN */}
      <div style={{ background: '#f8f9fa', padding: 25, borderRadius: 12, marginBottom: 40 }}>
        <h2 style={{ marginBottom: 15 }}>{isEditing ? 'Sửa đơn hàng' : 'Tạo đơn hàng mới'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Khách hàng */}
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: 'bold' }}>Khách hàng:</label>
            <select
              value={selectedCustomer}
              onChange={e => setSelectedCustomer(Number(e.target.value))}
              required
              style={{ width: '100%', padding: 8, marginTop: 6 }}
            >
              <option value={0}>-- Chọn khách hàng --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.full_name}</option>
              ))}
            </select>
          </div>

          {/* Sản phẩm */}
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: 'bold' }}>Sản phẩm trong đơn:</label>
            {orderItems.length === 0 ? <p>Chưa có sản phẩm</p> : (
              orderItems.map((item, idx) => {
                const product = products.find(p => p.id === item.product_id)
                const remainingStock = product ? product.stock : 0 // Chỉ hiển thị tồn kho thật
                return (
                  <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                    <select
                      value={item.product_id}
                      onChange={e => {
                        const newId = Number(e.target.value)
                        setOrderItems(prev => prev.map((i, iidx) => iidx === idx ? { ...i, product_id: newId } : i))
                      }}
                      style={{ flex: 2, padding: 6 }}
                    >
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} (Tồn: {p.stock})</option>)}
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={remainingStock}
                      value={item.quantity}
                      onChange={e => {
                        const q = Number(e.target.value)
                        if (q <= remainingStock) {
                          setOrderItems(prev => prev.map((i, iidx) => iidx === idx ? { ...i, quantity: q } : i))
                        }
                      }}
                      style={{ width: 60, padding: 6 }}
                    />
                    <span style={{ minWidth: 80 }}>Tồn còn: {remainingStock}</span>
                    <button type="button" onClick={() => handleRemoveItem(idx)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4 }}>Xóa</button>
                  </div>
                )
              })
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
              <select value={selectedProduct} onChange={e => setSelectedProduct(Number(e.target.value))} style={{ flex: 1, padding: 6 }}>
                <option value={0}>-- Chọn sản phẩm --</option>
                {products.filter(p => p.visible && p.stock > 0).map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Tồn: {p.stock})</option>
                ))}
              </select>
              <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: 60, padding: 6 }} />
              <button type="button" onClick={handleAddItem} style={{ padding: '6px 12px', background: '#3498db', color: 'white', border: 'none', borderRadius: 4 }}>Thêm</button>
            </div>
          </div>

          {/* Trạng thái */}
          {isEditing && (
            <div style={{ marginBottom: 15 }}>
              <label style={{ fontWeight: 'bold' }}>Trạng thái:</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as 'pending' | 'completed' | 'cancelled')}
                style={{ width: '100%', padding: 8, marginTop: 6 }}
              >
                <option value="pending">Chờ xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Hủy</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ flex: 1, padding: 12, background: isEditing ? '#f39c12' : '#27ae60', color: 'white', borderRadius: 6 }}>{isEditing ? 'LƯU' : 'Tạo đơn hàng'}</button>
            {isEditing && <button type="button" onClick={handleCancelEdit} style={{ flex: 1, padding: 12, background: '#e74c3c', color: 'white', borderRadius: 6 }}>HỦY</button>}
          </div>
        </form>
      </div>

      {/* TÌM KIẾM */}
      <input
        type="text"
        placeholder="Tìm mã đơn, tên khách, tên sản phẩm..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 20, borderRadius: 6, border: '1px solid #ccc' }}
      />

      {/* DANH SÁCH ĐƠN */}
      {loading ? <p>Đang tải...</p> : (
        filteredOrders.length === 0 ? <p>Không có đơn hàng</p> :
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#2c3e50', color: 'white' }}>
            <tr>
              <th style={{ padding: 10 }}>Mã đơn</th>
              <th style={{ padding: 10 }}>Khách hàng</th>
              <th style={{ padding: 10 }}>Thời gian</th>
              <th style={{ padding: 10 }}>Tổng tiền</th>
              <th style={{ padding: 10 }}>Trạng thái</th>
              <th style={{ padding: 10 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => {
              const cust = customers.find(c => c.id === o.customer_id)
              const statusColor =
                o.status === 'completed' ? '#27ae60' :
                o.status === 'pending' ? '#f1c40f' :
                '#e74c3c'

              return (
                <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 14, color: '#3498db', fontWeight: 'bold' }}>{o.order_code}</td>
                  <td style={{ padding: 14 }}>{cust?.full_name || 'Khách lẻ'}</td>
                  <td style={{ padding: 14 }}>{new Date(o.purchase_time).toLocaleString('vi-VN')}</td>
                  <td style={{ padding: 14, color: '#e74c3c', fontWeight: 'bold' }}>{o.total_amount.toLocaleString()}₫</td>
                  <td style={{ padding: 14, textAlign: 'center' }}>
                    <select
                      value={o.status}
                      onChange={e => handleStatusChange(o.id, e.target.value as 'pending' | 'completed' | 'cancelled')}
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        border: '1px solid #ddd',
                        color: statusColor,
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Hủy</option>
                    </select>
                  </td>
                  <td style={{ padding: 14, display: 'flex', gap: 6 }}>
                    <button onClick={() => openDetail(o.id)} style={{ padding: '4px 10px', borderRadius: 4 }}>Xem</button>
                    <button onClick={() => handleEdit(o.id)} style={{ padding: '4px 10px', borderRadius: 4, background: '#e74c3c', color: 'white' }}>Sửa</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {/* MODAL CHI TIẾT */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 10, width: '90%', maxWidth: 600 }}>
            {detailLoading ? <p>Đang tải...</p> : (
              <>
                <h2>Chi tiết đơn {selectedOrder.order_code}</h2>
                <p><b>Khách hàng:</b> {selectedOrder.customer_name}</p>
                <p><b>Địa chỉ:</b> {selectedOrder.customer_address}</p>
                <p><b>Điện thoại:</b> {selectedOrder.customer_phone}</p>
                <h3>Sản phẩm</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 6 }}>Tên SP</th>
                      <th style={{ padding: 6 }}>SL</th>
                      <th style={{ padding: 6 }}>Giá</th>
                      <th style={{ padding: 6 }}>Tồn còn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map(i => (
                      <tr key={i.id}>
                        <td style={{ padding: 6 }}>{i.product_name}</td>
                        <td style={{ padding: 6, textAlign: 'center' }}>{i.quantity}</td>
                        <td style={{ padding: 6, textAlign: 'center' }}>{i.unit_price.toLocaleString()}₫</td>
                        <td style={{ padding: 6, textAlign: 'center' }}>{i.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ marginTop: 10 }}><b>Tổng tiền:</b> {selectedOrder.total_amount.toLocaleString()}₫</p>
                <button onClick={() => setSelectedOrder(null)} style={{ marginTop: 10, width: '100%', padding: 10, background: '#e74c3c', color: 'white', borderRadius: 6 }}>Đóng</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderManagement
