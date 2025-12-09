// import { Request, Response } from 'express'
// import { pool } from '../config/db'
// import { ResultSetHeader, RowDataPacket } from 'mysql2'

// export const getOrders = async (req: Request, res: Response) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT o.*, c.full_name as customer_name 
//       FROM orders o 
//       LEFT JOIN customers c ON o.customer_id = c.id 
//       ORDER BY o.id DESC
//     `)
//     res.json(rows)
//   } catch (err) {
//     res.status(500).json({ message: 'Lỗi tải đơn hàng' })
//   }
// }

// export const createOrder = async (req: Request, res: Response) => {
//   const { customer_id, items } = req.body
//   const connection = await pool.getConnection()

//   try {
//     await connection.beginTransaction()

//     const orderCode = `DH${Date.now()}`
//     const [orderResult] = await connection.execute<ResultSetHeader>(
//       'INSERT INTO orders (order_code, customer_id, total_amount) VALUES (?, ?, ?)',
//       [orderCode, customer_id, 0]
//     )
//     const orderId = orderResult.insertId

//     let total = 0
//     for (const item of items) {
//       const [prodRows] = await connection.query<RowDataPacket[]>(
//         'SELECT price, stock FROM products WHERE id = ?', 
//         [item.product_id]
//       )
      
//       const product = prodRows[0]
//       if (!product || product.stock < item.quantity) {
//         throw new Error(`Sản phẩm ID ${item.product_id} không đủ hàng hoặc không tồn tại`)
//       }

//       await connection.execute(
//         'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
//         [orderId, item.product_id, item.quantity, product.price]
//       )

//       await connection.execute(
//         'UPDATE products SET stock = stock - ? WHERE id = ?',
//         [item.quantity, item.product_id]
//       )

//       total += product.price * item.quantity
//     }

//     await connection.execute('UPDATE orders SET total_amount = ? WHERE id = ?', [total, orderId])
    
//     await connection.commit()
//     res.json({ id: orderId, order_code: orderCode, customer_id, total_amount: total, items })

//   } catch (err: any) {
//     await connection.rollback()
//     console.error('Create Order Error:', err)
//     res.status(400).json({ message: err.message || 'Lỗi tạo đơn hàng' })
//   } finally {
//     connection.release()
//   }
// }

// export const updateOrderStatus = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { status } = req.body

//   try {
//     await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id])
//     res.json({ message: 'Cập nhật trạng thái thành công', id, status })
//   } catch (err) {
//     res.status(500).json({ message: 'Lỗi cập nhật đơn hàng' })
//   }
// }







// // src/controllers/orderController.ts
// import { Request, Response } from 'express'
// import { pool } from '../config/db'
// import { ResultSetHeader, RowDataPacket } from 'mysql2'

// export const getOrders = async (req: Request, res: Response) => {
//   try {
//     // hỗ trợ query param: ?search=...
//     const searchRaw = (req.query.search as string) || ''
//     const search = `%${searchRaw.trim()}%`

//     // nếu không truyền search (chuỗi rỗng) thì trả về tất cả
//     const [rows] = await pool.query<RowDataPacket[]>(
//       `
//       SELECT o.*, c.full_name as customer_name
//       FROM orders o
//       LEFT JOIN customers c ON o.customer_id = c.id
//       WHERE (? = '%%') OR (o.order_code LIKE ? OR c.full_name LIKE ?)
//       ORDER BY o.id DESC
//       `,
//       [search, search, search]
//     )

//     res.json(rows)
//   } catch (err) {
//     console.error('getOrders error:', err)
//     res.status(500).json({ message: 'Lỗi tải đơn hàng' })
//   }
// }

// export const getOrderById = async (req: Request, res: Response) => {
//   const { id } = req.params
//   try {
//     const [ordersRows] = await pool.query<RowDataPacket[]>(
//       `
//       SELECT o.*, c.full_name as customer_name, c.phone as customer_phone, c.address as customer_address, c.code as customer_code
//       FROM orders o
//       LEFT JOIN customers c ON o.customer_id = c.id
//       WHERE o.id = ?
//       `,
//       [id]
//     )

//     if (!ordersRows || ordersRows.length === 0) {
//       return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
//     }

//     const order = ordersRows[0]

//     const [itemsRows] = await pool.query<RowDataPacket[]>(
//       `
//       SELECT oi.id, oi.product_id, oi.quantity, oi.unit_price, p.name as product_name, p.code as product_code
//       FROM order_items oi
//       LEFT JOIN products p ON oi.product_id = p.id
//       WHERE oi.order_id = ?
//       `,
//       [id]
//     )

//     order.items = itemsRows || []

//     res.json(order)
//   } catch (err) {
//     console.error('getOrderById error:', err)
//     res.status(500).json({ message: 'Lỗi lấy chi tiết đơn hàng' })
//   }
// }

// export const createOrder = async (req: Request, res: Response) => {
//   const { customer_id, items } = req.body
//   const connection = await pool.getConnection()

//   try {
//     await connection.beginTransaction()

//     const orderCode = `DH${Date.now()}`
//     const [orderResult] = await connection.execute<ResultSetHeader>(
//       'INSERT INTO orders (order_code, customer_id, total_amount) VALUES (?, ?, ?)',
//       [orderCode, customer_id, 0]
//     )
//     const orderId = orderResult.insertId

//     let total = 0
//     for (const item of items) {
//       const [prodRows] = await connection.query<RowDataPacket[]>(
//         'SELECT price, stock FROM products WHERE id = ?',
//         [item.product_id]
//       )

//       const product = prodRows[0]
//       if (!product || product.stock < item.quantity) {
//         throw new Error(`Sản phẩm ID ${item.product_id} không đủ hàng hoặc không tồn tại`)
//       }

//       await connection.execute(
//         'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
//         [orderId, item.product_id, item.quantity, product.price]
//       )

//       await connection.execute(
//         'UPDATE products SET stock = stock - ? WHERE id = ?',
//         [item.quantity, item.product_id]
//       )

//       total += Number(product.price) * Number(item.quantity)
//     }

//     await connection.execute('UPDATE orders SET total_amount = ? WHERE id = ?', [total, orderId])

//     await connection.commit()
//     res.json({ id: orderId, order_code: orderCode, customer_id, total_amount: total, items })
//   } catch (err: any) {
//     await connection.rollback()
//     console.error('Create Order Error:', err)
//     res.status(400).json({ message: err.message || 'Lỗi tạo đơn hàng' })
//   } finally {
//     connection.release()
//   }
// }

// export const updateOrderStatus = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { status } = req.body

//   try {
//     await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id])
//     res.json({ message: 'Cập nhật trạng thái thành công', id, status })
//   } catch (err) {
//     console.error('updateOrderStatus error:', err)
//     res.status(500).json({ message: 'Lỗi cập nhật đơn hàng' })
//   }
// }








// import { Request, Response } from 'express'
// import { pool } from '../config/db'
// import { ResultSetHeader, RowDataPacket } from 'mysql2'

// // Lấy danh sách đơn hàng
// export const getOrders = async (req: Request, res: Response) => {
//   try {
//     const searchRaw = (req.query.search as string) || ''
//     const search = `%${searchRaw.trim()}%`

//     const [rows] = await pool.query<RowDataPacket[]>(
//       `
//       SELECT o.*, c.full_name as customer_name
//       FROM orders o
//       LEFT JOIN customers c ON o.customer_id = c.id
//       WHERE (? = '%%') OR (o.order_code LIKE ? OR c.full_name LIKE ?)
//       ORDER BY o.id DESC
//       `,
//       [search, search, search]
//     )

//     res.json(rows)
//   } catch (err) {
//     console.error('getOrders error:', err)
//     res.status(500).json({ message: 'Lỗi tải đơn hàng' })
//   }
// }

// // Xem chi tiết đơn hàng
// export const getOrderById = async (req: Request, res: Response) => {
//   const { id } = req.params
//   try {
//     const [ordersRows] = await pool.query<RowDataPacket[]>(
//       `
//       SELECT o.*, c.full_name as customer_name, c.phone as customer_phone, c.address as customer_address, c.code as customer_code, o.status
//       FROM orders o
//       LEFT JOIN customers c ON o.customer_id = c.id
//       WHERE o.id = ?
//       `,
//       [id]
//     )

//     if (!ordersRows || ordersRows.length === 0) {
//       return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
//     }

//     const order = ordersRows[0]

//     const [itemsRows] = await pool.query<RowDataPacket[]>(
//       `
//       SELECT oi.id, oi.product_id, oi.quantity, oi.unit_price, p.name as product_name, p.code as product_code
//       FROM order_items oi
//       LEFT JOIN products p ON oi.product_id = p.id
//       WHERE oi.order_id = ?
//       `,
//       [id]
//     )

//     order.items = itemsRows ? itemsRows.map(i => ({
//       id: i.id,
//       product_id: i.product_id,
//       quantity: i.quantity,
//       unit_price: i.unit_price,
//       product_name: i.product_name
//     })) : []

//     res.json(order)
//   } catch (err) {
//     console.error('getOrderById error:', err)
//     res.status(500).json({ message: 'Lỗi lấy chi tiết đơn hàng' })
//   }
// }

// // Tạo đơn hàng mới
// export const createOrder = async (req: Request, res: Response) => {
//   const { customer_id, items } = req.body
//   const connection = await pool.getConnection()

//   try {
//     await connection.beginTransaction()

//     const orderCode = `DH${Date.now()}`
//     const [orderResult] = await connection.execute<ResultSetHeader>(
//       'INSERT INTO orders (order_code, customer_id, total_amount, status) VALUES (?, ?, ?, ?)',
//       [orderCode, customer_id, 0, 'pending']
//     )
//     const orderId = orderResult.insertId

//     let total = 0
//     const itemsWithNames = []

//     for (const item of items) {
//       const [prodRows] = await connection.query<RowDataPacket[]>(
//         'SELECT name, price, stock FROM products WHERE id = ?',
//         [item.product_id]
//       )

//       const product = prodRows[0]
//       if (!product || product.stock < item.quantity) {
//         throw new Error(`Sản phẩm ID ${item.product_id} không đủ hàng hoặc không tồn tại`)
//       }

//       await connection.execute(
//         'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
//         [orderId, item.product_id, item.quantity, product.price]
//       )

//       await connection.execute(
//         'UPDATE products SET stock = stock - ? WHERE id = ?',
//         [item.quantity, item.product_id]
//       )

//       total += Number(product.price) * Number(item.quantity)

//       itemsWithNames.push({
//         product_id: item.product_id,
//         quantity: item.quantity,
//         unit_price: product.price,
//         product_name: product.name
//       })
//     }

//     await connection.execute('UPDATE orders SET total_amount = ? WHERE id = ?', [total, orderId])

//     await connection.commit()
//     res.json({
//       id: orderId,
//       order_code: orderCode,
//       customer_id,
//       total_amount: total,
//       status: 'pending',
//       items: itemsWithNames
//     })
//   } catch (err: any) {
//     await connection.rollback()
//     console.error('Create Order Error:', err)
//     res.status(400).json({ message: err.message || 'Lỗi tạo đơn hàng' })
//   } finally {
//     connection.release()
//   }
// }

// // Cập nhật trạng thái đơn hàng
// export const updateOrderStatus = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { status } = req.body

//   try {
//     await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id])
//     res.json({ message: 'Cập nhật trạng thái thành công', id, status })
//   } catch (err) {
//     console.error('updateOrderStatus error:', err)
//     res.status(500).json({ message: 'Lỗi cập nhật đơn hàng' })
//   }
// }

// // Cập nhật toàn bộ đơn hàng (sửa đơn)
// export const updateOrder = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { customer_id, items, status } = req.body
//   const connection = await pool.getConnection()

//   try {
//     await connection.beginTransaction()

//     // Cập nhật khách hàng và trạng thái
//     await connection.execute(
//       'UPDATE orders SET customer_id = ?, status = ? WHERE id = ?',
//       [customer_id, status, id]
//     )

//     // Lấy các sản phẩm cũ để trả tồn kho
//     const [oldItems] = await connection.query<RowDataPacket[]>(
//       'SELECT * FROM order_items WHERE order_id = ?',
//       [id]
//     )

//     for (const item of oldItems) {
//       await connection.execute(
//         'UPDATE products SET stock = stock + ? WHERE id = ?',
//         [item.quantity, item.product_id]
//       )
//     }

//     // Xóa sản phẩm cũ
//     await connection.execute('DELETE FROM order_items WHERE order_id = ?', [id])

//     // Thêm sản phẩm mới và trừ tồn kho
//     let total = 0
//     const itemsWithNames = []

//     for (const item of items) {
//       const [prodRows] = await connection.query<RowDataPacket[]>(
//         'SELECT name, price, stock FROM products WHERE id = ?',
//         [item.product_id]
//       )
//       const product = prodRows[0]
//       if (!product || product.stock < item.quantity) {
//         throw new Error(`Sản phẩm ${item.product_id} không đủ hàng hoặc không tồn tại`)
//       }

//       await connection.execute(
//         'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
//         [id, item.product_id, item.quantity, product.price]
//       )

//       await connection.execute(
//         'UPDATE products SET stock = stock - ? WHERE id = ?',
//         [item.quantity, item.product_id]
//       )

//       total += Number(product.price) * Number(item.quantity)
//       itemsWithNames.push({
//         product_id: item.product_id,
//         quantity: item.quantity,
//         unit_price: product.price,
//         product_name: product.name
//       })
//     }

//     // Cập nhật tổng tiền
//     await connection.execute('UPDATE orders SET total_amount = ? WHERE id = ?', [total, id])

//     await connection.commit()

//     res.json({
//       id,
//       customer_id,
//       total_amount: total,
//       status,
//       items: itemsWithNames
//     })
//   } catch (err: any) {
//     await connection.rollback()
//     console.error('updateOrder error:', err)
//     res.status(400).json({ message: err.message || 'Lỗi cập nhật đơn hàng' })
//   } finally {
//     connection.release()
//   }
// }










import { Request, Response } from 'express'
import { pool } from '../config/db'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

// Lấy danh sách đơn hàng
export const getOrders = async (req: Request, res: Response) => {
  try {
    const searchRaw = (req.query.search as string) || ''
    const search = `%${searchRaw.trim()}%`

    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT o.*, c.full_name as customer_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE (? = '%%') OR (o.order_code LIKE ? OR c.full_name LIKE ?)
      ORDER BY o.id DESC
      `,
      [search, search, search]
    )

    res.json(rows)
  } catch (err) {
    console.error('getOrders error:', err)
    res.status(500).json({ message: 'Lỗi tải đơn hàng' })
  }
}

// Xem chi tiết đơn hàng
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const [ordersRows] = await pool.query<RowDataPacket[]>(
      `
      SELECT o.*, c.full_name as customer_name, c.phone as customer_phone, c.address as customer_address, c.code as customer_code, o.status
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
      `,
      [id]
    )

    if (!ordersRows || ordersRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    }

    const order = ordersRows[0]

    const [itemsRows] = await pool.query<RowDataPacket[]>(
      `
      SELECT oi.id, oi.product_id, oi.quantity, oi.unit_price, p.name as product_name, p.code as product_code, p.stock
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      `,
      [id]
    )

    order.items = itemsRows ? itemsRows.map(i => ({
      id: i.id,
      product_id: i.product_id,
      quantity: i.quantity,
      unit_price: i.unit_price,
      product_name: i.product_name,
      stock: i.stock
    })) : []

    res.json(order)
  } catch (err) {
    console.error('getOrderById error:', err)
    res.status(500).json({ message: 'Lỗi lấy chi tiết đơn hàng' })
  }
}

// Tạo đơn hàng mới
export const createOrder = async (req: Request, res: Response) => {
  const { customer_id, items, status } = req.body
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const orderCode = `DH${Date.now()}`
    const [orderResult] = await connection.execute<ResultSetHeader>(
      'INSERT INTO orders (order_code, customer_id, total_amount, status) VALUES (?, ?, ?, ?)',
      [orderCode, customer_id, 0, status || 'pending']
    )
    const orderId = orderResult.insertId

    let total = 0
    const itemsWithNames = []

    for (const item of items) {
      const [prodRows] = await connection.query<RowDataPacket[]>(
        'SELECT name, price, stock FROM products WHERE id = ?',
        [item.product_id]
      )

      const product = prodRows[0]
      if (!product) throw new Error(`Sản phẩm ID ${item.product_id} không tồn tại`)
      if (status === 'completed' && product.stock < item.quantity) {
        throw new Error(`Sản phẩm ${product.name} không đủ hàng để hoàn thành đơn`)
      }

      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, product.price]
      )

      // Trừ kho nếu trạng thái completed
      if (status === 'completed') {
        await connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id])
      }

      total += Number(product.price) * Number(item.quantity)
      itemsWithNames.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        product_name: product.name
      })
    }

    await connection.execute('UPDATE orders SET total_amount = ? WHERE id = ?', [total, orderId])

    await connection.commit()
    res.json({
      id: orderId,
      order_code: orderCode,
      customer_id,
      total_amount: total,
      status: status || 'pending',
      items: itemsWithNames
    })
  } catch (err: any) {
    await connection.rollback()
    console.error('Create Order Error:', err)
    res.status(400).json({ message: err.message || 'Lỗi tạo đơn hàng' })
  } finally {
    connection.release()
  }
}

// Cập nhật trạng thái đơn hàng và tồn kho
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status: newStatus } = req.body
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [orderRows] = await connection.query<RowDataPacket[]>('SELECT status FROM orders WHERE id = ?', [id])
    if (!orderRows.length) throw new Error('Không tìm thấy đơn hàng')
    const oldStatus = orderRows[0].status

    const [itemsRows] = await connection.query<RowDataPacket[]>('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [id])

    for (const item of itemsRows) {
      // Completed → pending/cancelled: cộng lại kho
      if (oldStatus === 'completed' && (newStatus === 'pending' || newStatus === 'cancelled')) {
        await connection.execute('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id])
      }
      // Pending/cancelled → completed: trừ kho
      else if ((oldStatus === 'pending' || oldStatus === 'cancelled') && newStatus === 'completed') {
        const [prodRows] = await connection.query<RowDataPacket[]>('SELECT stock FROM products WHERE id = ?', [item.product_id])
        if (!prodRows.length || prodRows[0].stock < item.quantity) {
          throw new Error(`Sản phẩm ID ${item.product_id} không đủ hàng để hoàn thành đơn`)
        }
        await connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id])
      }
    }

    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', [newStatus, id])
    await connection.commit()
    res.json({ message: 'Cập nhật trạng thái thành công', id, status: newStatus })
  } catch (err: any) {
    await connection.rollback()
    console.error('updateOrderStatus error:', err)
    res.status(400).json({ message: err.message || 'Lỗi cập nhật trạng thái' })
  } finally {
    connection.release()
  }
}

// Cập nhật toàn bộ đơn hàng (sửa đơn)
export const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params
  const { customer_id, items, status } = req.body
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [orderRows] = await connection.query<RowDataPacket[]>('SELECT status FROM orders WHERE id = ?', [id])
    if (!orderRows.length) throw new Error('Không tìm thấy đơn hàng')
    const oldStatus = orderRows[0].status

    const [oldItems] = await connection.query<RowDataPacket[]>('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [id])

    // Trả kho các sản phẩm cũ nếu đơn cũ là completed
    if (oldStatus === 'completed') {
      for (const item of oldItems) {
        await connection.execute('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id])
      }
    }

    // Xóa sản phẩm cũ
    await connection.execute('DELETE FROM order_items WHERE order_id = ?', [id])

    let total = 0
    const itemsWithNames = []

    for (const item of items) {
      const [prodRows] = await connection.query<RowDataPacket[]>('SELECT name, price, stock FROM products WHERE id = ?', [item.product_id])
      const product = prodRows[0]
      if (!product) throw new Error(`Sản phẩm ${item.product_id} không tồn tại`)
      // Nếu trạng thái completed, kiểm tra tồn kho
      if (status === 'completed' && product.stock < item.quantity) {
        throw new Error(`Sản phẩm ${product.name} không đủ hàng để hoàn thành đơn`)
      }

      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [id, item.product_id, item.quantity, product.price]
      )

      if (status === 'completed') {
        await connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id])
      }

      total += Number(product.price) * Number(item.quantity)
      itemsWithNames.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        product_name: product.name
      })
    }

    await connection.execute(
      'UPDATE orders SET customer_id = ?, total_amount = ?, status = ? WHERE id = ?',
      [customer_id, total, status, id]
    )

    await connection.commit()
    res.json({
      id,
      customer_id,
      total_amount: total,
      status,
      items: itemsWithNames
    })
  } catch (err: any) {
    await connection.rollback()
    console.error('updateOrder error:', err)
    res.status(400).json({ message: err.message || 'Lỗi cập nhật đơn hàng' })
  } finally {
    connection.release()
  }
}
