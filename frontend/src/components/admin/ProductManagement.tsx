import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../redux/slices/productSlice'

interface ProductForm {
  id?: number, code: string, name: string, price: number, stock: number, image_url: string
}

const ProductManagement: React.FC = () => {
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector(state => state.products)
  
  const [formData, setFormData] = useState<ProductForm>({ id: undefined, code: '', name: '', price: 0, stock: 0, image_url: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { dispatch(fetchProducts()) }, [dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    let finalValue: string | number = value

    if (name === 'price') {
      const numValue = Number(value)
      finalValue = value === '' ? 0 : Math.max(0, numValue)
    } 
    else if (name === 'code') {
      finalValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing && formData.id !== undefined) {
      dispatch(updateProduct({ id: formData.id, data: formData }))
    } else {
      const { id, ...newProduct } = formData
      dispatch(addProduct({ ...newProduct, stock: 0 }))
    }
    setFormData({ id: undefined, code: '', name: '', price: 0, stock: 0, image_url: '' })
    setIsEditing(false)
  }

  const handleEdit = (product: any) => {
    setFormData({ 
      id: product.id, 
      code: product.code, 
      name: product.name, 
      price: product.price, 
      stock: product.stock, 
      image_url: product.image_url || '' 
    })
    setIsEditing(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Xóa sản phẩm này?')) dispatch(deleteProduct(id))
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) return <div className="container"><p>Đang tải...</p></div>

  return (
    <div className="container" style={{ padding: '30px 0' }}>
      <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
        <h2 style={{ marginTop: 0 }}>{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Mã sản phẩm</label>
              <input name="code" placeholder="Ví dụ: SP001" value={formData.code} onChange={handleChange} required style={{width:'100%'}} />
            </div>
            
            <div>
              <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Tên sản phẩm</label>
              <input name="name" placeholder="Ví dụ: Áo thun" value={formData.name} onChange={handleChange} required style={{width:'100%'}} />
            </div>

            <div>
              <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Giá bán</label>
              <input 
                type="number" 
                name="price" 
                placeholder="VNĐ" 
                value={formData.price || ''} 
                onChange={handleChange} 
                required 
                min={0}
                style={{width:'100%'}} 
              />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Link ảnh</label>
              <input name="image_url" placeholder="https://..." value={formData.image_url} onChange={handleChange} style={{width:'100%'}} />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ background: isEditing ? '#f39c12' : '#27ae60' }}>{isEditing ? 'LƯU' : 'THÊM'}</button>
            {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: undefined, code: '', name: '', price: 0, stock: 0, image_url: '' }) }} style={{ background: '#95a5a6' }}>HỦY</button>}
          </div>
        </form>
      </div>

      <input placeholder="Tìm kiếm sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px' }} />

      <table style={{ background: 'white' }}>
        <thead style={{ background: '#2c3e50', color: 'white' }}>
          <tr>
            <th>Ảnh</th><th>Mã</th><th>Tên</th><th>Giá bán</th>
            <th>Tồn kho</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => (
            <tr key={p.id}>
              <td style={{ textAlign: 'center' }}>
                {p.image_url ? <img src={p.image_url} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /> : <span style={{color: '#ccc'}}>No img</span>}
              </td>
              <td><strong>{p.code}</strong></td>
              <td>{p.name}</td>
              <td style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                {Number(p.price).toLocaleString('vi-VN')} ₫
              </td>
              <td>
                <span style={{ 
                  padding: '5px 10px', 
                  borderRadius: '12px', 
                  background: p.stock > 0 ? '#d5f5e3' : '#fadbd8',
                  color: p.stock > 0 ? '#27ae60' : '#c0392b',
                  fontWeight: 'bold'
                }}>
                  {p.stock}
                </span>
              </td>
              
              <td style={{ textAlign: 'center' }}>
                <button onClick={() => handleEdit(p)} style={{ marginRight: '5px' }}>Sửa</button>
                <button onClick={() => handleDelete(p.id)} style={{ background: '#e74c3c' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductManagement