import { Request, Response } from 'express'
import { pool } from '../config/db'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải danh sách sản phẩm' })
  }
}

export const addProduct = async (req: Request, res: Response) => {
  const { code, name, price, stock, image_url } = req.body
  try {
    const [result] = await pool.execute(
      'INSERT INTO products (code, name, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
      [code, name, price, stock, image_url || null]
    )
    res.json({ 
      id: (result as any).insertId, 
      code, 
      name, 
      price, 
      stock, 
      image_url: image_url || null 
    })
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Mã sản phẩm đã tồn tại!' })
    } else {
      console.error(err)
      res.status(500).json({ message: 'Lỗi thêm sản phẩm' })
    }
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  const { code, name, price, stock, image_url } = req.body
  
  try {
    const [result] = await pool.execute(
      'UPDATE products SET code = ?, name = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
      [code, name, price, stock, image_url || null, id]
    )

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' })
    }

    res.json({ id: Number(id), code, name, price, stock, image_url })
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Mã sản phẩm mới bị trùng!' })
    } else {
      res.status(500).json({ message: 'Lỗi cập nhật sản phẩm' })
    }
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const [rows] = await pool.query('SELECT id FROM products WHERE id = ?', [id])
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
    await pool.execute('DELETE FROM products WHERE id = ?', [id])
    
    res.json({ message: 'Xóa sản phẩm thành công!', deletedId: Number(id) })
  } catch (err: any) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
      res.status(400).json({ message: 'Không thể xóa! Sản phẩm này đang nằm trong đơn hàng hoặc phiếu nhập.' })
    } else {
      console.error('Lỗi xóa sản phẩm:', err)
      res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm' })
    }
  }
}