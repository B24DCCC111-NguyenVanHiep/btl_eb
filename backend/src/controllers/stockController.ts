import { Request, Response } from 'express'
import { pool } from '../config/db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export const getStockEntries = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT se.*, GROUP_CONCAT(CONCAT(p.name, ' (SL:', sei.quantity, ' - Giá:', sei.import_price, ')') SEPARATOR ', ') as items_detail
      FROM stock_entries se
      LEFT JOIN stock_entry_items sei ON se.id = sei.stock_entry_id
      LEFT JOIN products p ON sei.product_id = p.id
      GROUP BY se.id
      ORDER BY se.id DESC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải phiếu nhập kho' })
  }
}

export const createStockEntry = async (req: Request, res: Response) => {
  const { supplier, items } = req.body
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const entryCode = `NK${Date.now()}`
    const [entryResult] = await connection.execute<ResultSetHeader>(
      'INSERT INTO stock_entries (entry_code, supplier) VALUES (?, ?)',
      [entryCode, supplier]
    )
    const entryId = entryResult.insertId

    for (const item of items) {
      const { product_id, quantity, import_price } = item

      const [prodRows] = await connection.query<RowDataPacket[]>('SELECT id FROM products WHERE id = ?', [product_id])
      if (prodRows.length === 0) {
        throw new Error(`Sản phẩm ID ${product_id} không tồn tại`)
      }

      await connection.execute(
        'INSERT INTO stock_entry_items (stock_entry_id, product_id, quantity, import_price) VALUES (?, ?, ?, ?)',
        [entryId, product_id, quantity, import_price]
      )

      await connection.execute(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [quantity, product_id]
      )
    }

    await connection.commit()

    res.json({
      success: true,
      message: 'Nhập kho thành công!',
      entry: { id: entryId, entry_code: entryCode, supplier, items }
    })
  } catch (err: any) {
    await connection.rollback()
    console.error('Lỗi nhập kho:', err)
    res.status(400).json({ message: err.message || 'Lỗi nhập kho' })
  } finally {
    connection.release()
  }
}