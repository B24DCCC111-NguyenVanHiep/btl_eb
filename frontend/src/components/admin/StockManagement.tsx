import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchStockEntries, createStockEntry } from '../../redux/slices/stockSlice'
import { fetchProducts } from '../../redux/slices/productSlice'

const StockManagement: React.FC = () => {
  const dispatch = useAppDispatch()
  
  const { entries, loading: stockLoading } = useAppSelector(state => state.stock)
  const { products, loading: productsLoading } = useAppSelector(state => state.products)

  const [supplier, setSupplier] = useState('')
  const [items, setItems] = useState<{ product_id: number; quantity: number; import_price: number }[]>([])
  const [selectedProduct, setSelectedProduct] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [importPrice, setImportPrice] = useState(0)

  useEffect(() => {
    dispatch(fetchStockEntries())
    dispatch(fetchProducts())
  }, [dispatch])

  const handleAddItem = () => {
    if (selectedProduct && quantity > 0 && importPrice >= 0) {
      const existingItemIndex = items.findIndex(i => i.product_id === selectedProduct)
      
      if (existingItemIndex >= 0) {
        const newItems = [...items]
        newItems[existingItemIndex].quantity += quantity
        newItems[existingItemIndex].import_price = importPrice 
        setItems(newItems)
      } else {
        setItems([...items, { product_id: selectedProduct, quantity, import_price: importPrice }])
      }
      
      setSelectedProduct(0)
      setQuantity(1)
      setImportPrice(0)
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (supplier.trim() && items.length > 0) {
      dispatch(createStockEntry({ supplier: supplier.trim(), items }))
        .unwrap()
        .then(() => {
          alert('Nhập kho thành công!')
          setSupplier('')
          setItems([])
        })
        .catch((err) => {
          alert(`Lỗi: ${err.message || 'Không thể nhập kho'}`)
        })
    }
  }

  const loading = stockLoading || productsLoading

  return (
    <div className="container" style={{ padding: '30px 0', color: '#2c3e50' }}>
      
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
          Tạo phiếu nhập mới
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Nhà cung cấp:
            </label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="VD: Xưởng may A..."
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px', border: '1px dashed #bbb' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>
              Chi tiết nhập hàng:
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(Number(e.target.value))}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', flex: 2, minWidth: '200px' }}
              >
                <option value={0}>-- Chọn sản phẩm --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Tồn: {p.stock})
                  </option>
                ))}
              </select>


              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="SL"
                style={{ width: '80px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}
              />

              <div style={{ position: 'relative', width: '140px' }}>
                <input
                  type="number"
                  min="0"
                  value={importPrice}
                  onChange={(e) => setImportPrice(Number(e.target.value))}
                  placeholder="0"
                  style={{ 
                    width: '100%', 
                    padding: '12px 45px 12px 12px', 
                    borderRadius: '8px', 
                    border: '1px solid #ddd',
                    textAlign: 'right',
                    fontWeight: 'bold'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  fontSize: '12px',
                  fontWeight: '600',
                  pointerEvents: 'none' 
                }}>
                  VNĐ
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                disabled={!selectedProduct || quantity <= 0}
                style={{ 
                  padding: '12px 24px', 
                  background: (selectedProduct && quantity > 0) ? '#3498db' : '#ccc', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: (selectedProduct && quantity > 0) ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold'
                }}
              >
                + Thêm
              </button>
            </div>
          </div>

          {items.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Danh sách trong phiếu ({items.length})</h3>
              <table style={{ width: '100%', background: 'white', borderRadius: '8px', overflow: 'hidden', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#ecf0f1', color: '#2c3e50' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #bdc3c7' }}>Sản phẩm</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #bdc3c7' }}>Số lượng</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #bdc3c7' }}>Giá nhập</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #bdc3c7' }}>Tổng</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #bdc3c7' }}>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const product = products.find(p => p.id === item.product_id)
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>
                          <strong>{product?.name}</strong> <br/>
                          <small style={{color:'#777'}}>{product?.code}</small>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                          {item.quantity}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#e67e22' }}>
                          {item.import_price.toLocaleString()}₫
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                          {(item.quantity * item.import_price).toLocaleString()}₫
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="submit"
            disabled={!supplier.trim() || items.length === 0}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: supplier.trim() && items.length > 0 ? '#27ae60' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: supplier.trim() && items.length > 0 ? 'pointer' : 'not-allowed',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            HOÀN TẤT NHẬP KHO
          </button>
        </form>
      </div>

      <h2 style={{ borderLeft: '5px solid #3498db', paddingLeft: '15px', marginBottom: '20px' }}>
        Lịch sử nhập kho
      </h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : entries.length === 0 ? (
        <div style={{ padding: '30px', background: '#fff', borderRadius: '8px', textAlign: 'center', color: '#7f8c8d' }}>
          Chưa có phiếu nhập kho nào.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#2c3e50', color: 'white' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left' }}>Mã phiếu</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Thời gian</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Nhà cung cấp</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Chi tiết nhập</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s' }}>
                  <td style={{ padding: '15px' }}>
                    <strong style={{ color: '#2980b9' }}>{entry.entry_code}</strong>
                  </td>
                  <td style={{ padding: '15px' }}>
                    {new Date(entry.entry_time).toLocaleString('vi-VN')}
                  </td>
                  <td style={{ padding: '15px', fontWeight: '500' }}>
                    {entry.supplier}
                  </td>
                  <td style={{ padding: '15px' }}>
                    {entry.items_detail ? (
                      <span style={{ fontSize: '14px', color: '#444' }}>
                        {entry.items_detail}
                      </span>
                    ) : (
                      <span style={{ fontStyle: 'italic', color: '#888' }}>
                         {entry.items ? `${entry.items.length} mặt hàng` : 'Đang cập nhật...'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default StockManagement