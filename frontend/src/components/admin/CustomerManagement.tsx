import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../redux/slices/customerSlice'

interface Customer {
  id: number
  code: string
  full_name: string
  birth_year: number
  address: string
  phone?: string
}

interface CustomerForm {
  id: number
  code: string
  full_name: string
  birth_year: number
  address: string
  phone: string
}

const CustomerManagement: React.FC = () => {
  const dispatch = useAppDispatch()
  const { customers, loading } = useAppSelector(state => state.customers)

  const [formData, setFormData] = useState<CustomerForm>({
    id: 0,
    code: '',
    full_name: '',
    birth_year: 0,
    address: '',
    phone: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { dispatch(fetchCustomers()) }, [dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    let finalValue: string | number = value

    if (name === 'phone') {
      finalValue = value.replace(/[^0-9]/g, '')
    } 
    else if (name === 'code') {
      finalValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    }
    else if (name === 'birth_year') {
      const numValue = Number(value)
      finalValue = value === '' ? 0 : Math.max(0, numValue)
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dataToSend = {
      code: formData.code,
      full_name: formData.full_name,
      birth_year: formData.birth_year,
      address: formData.address,
      phone: formData.phone
    }

    if (isEditing) {
      dispatch(updateCustomer({ id: formData.id, customer: dataToSend }))
        .unwrap()
        .then(() => {
          alert('Cập nhật thành công!')
          setIsEditing(false)
          resetForm()
        })
        .catch((err: unknown) => {
          if (err instanceof Error) alert(`Lỗi: ${err.message}`)
          else alert('Có lỗi xảy ra')
        })
    } else {
      dispatch(addCustomer(dataToSend))
        .unwrap()
        .then(() => {
          alert('Thêm mới thành công!')
          resetForm()
        })
        .catch((err: unknown) => {
          if (err instanceof Error) alert(`Lỗi: ${err.message}`)
          else alert('Có lỗi xảy ra')
        })
    }
  }

  const resetForm = () => {
    setFormData({ id: 0, code: '', full_name: '', birth_year: 0, address: '', phone: '' })
  }

  const handleEdit = (customer: Customer) => {
    setFormData({
      id: customer.id,
      code: customer.code,
      full_name: customer.full_name,
      birth_year: customer.birth_year,
      address: customer.address,
      phone: customer.phone || ''
    })
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn XÓA khách hàng này?')) {
      dispatch(deleteCustomer(id)).catch(err => alert(err))
    }
  }

  const filteredCustomers = customers.filter(c =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(searchTerm))
  )

  if (loading) return <div className="container" style={{padding: '20px'}}>Đang tải...</div>

  return (
    <div className="container" style={{ padding: '30px 0', color: '#2c3e50' }}>
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0 }}>{isEditing ? 'Sửa khách hàng' : 'Thêm khách hàng'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Mã KH</label>
              <input name="code" placeholder="VD: KH01" value={formData.code} onChange={handleChange} required disabled={isEditing} style={{width:'100%'}} />
            </div>

            <div>
              <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Họ tên</label>
              <input name="full_name" placeholder="Nguyễn Văn A" value={formData.full_name} onChange={handleChange} required style={{width:'100%'}} />
            </div>
            
            <div>
              <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Số điện thoại</label>
              <input name="phone" placeholder="09..." value={formData.phone} onChange={handleChange} required maxLength={10} style={{width:'100%'}} />
            </div>
            
            <div>
              <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Năm sinh</label>
              <input 
                type="number" 
                name="birth_year" 
                placeholder="1990" 
                value={formData.birth_year || ''} 
                onChange={handleChange} 
                required 
                min={1900} 
                max={new Date().getFullYear()}
                style={{width:'100%'}} 
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Địa chỉ</label>
              <input name="address" placeholder="Hà Nội..." value={formData.address} onChange={handleChange} required style={{width:'100%'}} />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ background: isEditing ? '#f39c12' : '#27ae60' }}>{isEditing ? 'LƯU' : 'THÊM'}</button>
            {isEditing && <button type="button" onClick={() => { setIsEditing(false); resetForm() }} style={{ background: '#95a5a6' }}>HỦY</button>}
          </div>
        </form>
      </div>

      <input placeholder="Tìm theo Mã, Tên hoặc SĐT..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px' }} />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#2c3e50', color: 'white' }}>
            <tr>
              <th style={{ padding: '15px' }}>Mã KH</th>
              <th style={{ padding: '15px' }}>Họ tên</th>
              <th style={{ padding: '15px' }}>SĐT</th>
              <th style={{ padding: '15px' }}>Năm sinh</th>
              <th style={{ padding: '15px' }}>Địa chỉ</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}><strong>{c.code}</strong></td>
                <td style={{ padding: '15px' }}>{c.full_name}</td>
                <td style={{ padding: '15px', color: '#2980b9', fontWeight: 'bold' }}>{c.phone || '-'}</td>
                <td style={{ padding: '15px' }}>{c.birth_year}</td>
                <td style={{ padding: '15px' }}>{c.address}</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(c)} style={{ marginRight: '5px' }}>Sửa</button>
                  <button onClick={() => {handleDelete(c.id)}} style={{ background: '#e74c3c' }}>Xóa</button>
                  
              
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerManagement

