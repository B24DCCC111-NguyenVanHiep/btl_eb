import { Request, Response } from 'express'
import { pool } from '../config/db'
import { RowDataPacket } from 'mysql2'

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    await pool.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, 'admin'] 
    )

    res.json({ message: 'Đăng ký Admin thành công' })

  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' })
    } else {
      res.status(500).json({ message: 'Lỗi server' })
    }
  }
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, role, customer_id FROM users WHERE username = ? AND password = ?',
      [username, password]
    )
    const user = rows[0]
    
    if (user) {
      res.json({ user }) 
    } else {
      res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' })
  }
}