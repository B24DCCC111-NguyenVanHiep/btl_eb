import { Request, Response } from 'express'
import { pool } from '../config/db'
import { ResultSetHeader } from 'mysql2'

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers ORDER BY id DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải danh sách khách hàng' })
  }
}
export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
     const [result] = await pool.execute<ResultSetHeader>('DELETE FROM customers WHERE id = ?', [id])
    
     if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Khách hàng không tồn tại' })
     }
    
     res.json({ message: 'Xóa thành công!', id: Number(id) })
   } catch (err: any) {
     if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
       res.status(400).json({ message: 'Không thể xóa! Khách hàng này đang có đơn hàng.' })
     } else {
       res.status(500).json({ message: 'Lỗi server khi xóa' })
     }
   }
 }

export const addCustomer = async (req: Request, res: Response) => {
  const { code, full_name, birth_year, address, phone } = req.body
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO customers (code, full_name, birth_year, address, phone) VALUES (?, ?, ?, ?, ?)',
      [code, full_name, birth_year, address, phone || null]
    )
    res.json({ id: result.insertId, code, full_name, birth_year, address, phone })
  } catch (err: any) {
    handleCustomerError(err, res)
  }
}

export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params
  const { code, full_name, birth_year, address, phone } = req.body
  
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE customers SET code = ?, full_name = ?, birth_year = ?, address = ?, phone = ? WHERE id = ?',
      [code, full_name, birth_year, address, phone || null, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' })
    }

    res.json({ id: Number(id), code, full_name, birth_year, address, phone })
  } catch (err: any) {
    handleCustomerError(err, res)
  }
}

// Xóa deleteCustomer để loại bỏ hoàn toàn tính năng xóa
/*
export const deleteCustomer = async (req: Request, res: Response) => {
  // ...bỏ
}
*/

const handleCustomerError = (err: any, res: Response) => {
  if (err.code === 'ER_DUP_ENTRY') {
    if (err.sqlMessage.includes('phone')) {
      res.status(400).json({ message: 'Số điện thoại này đã tồn tại!' })
    } else {
      res.status(400).json({ message: 'Mã khách hàng đã tồn tại!' })
    }
  } else {
    res.status(500).json({ message: 'Lỗi server' })
  }
}
