import { Request, Response } from 'express'
import { pool } from '../config/db'
import { RowDataPacket } from 'mysql2'

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      productRes,
      customerRes,
      orderRes,
      stockRes
    ] = await Promise.all([
      pool.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM products'),
      pool.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM customers'),
      pool.query<RowDataPacket[]>(`
        SELECT COUNT(*) as total_orders, SUM(total_amount) as revenue 
        FROM orders WHERE status = 'completed'
      `),
      pool.query<RowDataPacket[]>('SELECT SUM(stock) as total_stock FROM products')
    ])
    const stats = {
      totalProducts: productRes[0][0].total || 0,
      totalCustomers: customerRes[0][0].total || 0,
      totalOrders: orderRes[0][0].total_orders || 0,
      revenue: orderRes[0][0].revenue || 0,
      totalStock: stockRes[0][0].total_stock || 0,
    }

    res.json(stats)
  } catch (err) {
    console.error('Dashboard Error:', err)
    res.status(500).json({ message: 'Lỗi server khi tải thống kê' })
  }
}