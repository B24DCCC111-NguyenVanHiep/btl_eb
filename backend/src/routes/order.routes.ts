// import { Router } from 'express'
// import { getOrders, createOrder, updateOrderStatus } from '../controllers/orderController'

// const router = Router()

// router.get('/', getOrders)
// router.post('/', createOrder)
// router.put('/:id/status', updateOrderStatus)

// export default router









import { Router } from 'express'
import { getOrders, createOrder, updateOrderStatus, getOrderById, updateOrder } from '../controllers/orderController'

const router = Router()

// Lấy danh sách đơn hàng
router.get('/', getOrders)

// Xem chi tiết 1 đơn hàng
router.get('/:id', getOrderById)

// Tạo đơn hàng mới
router.post('/', createOrder)

// Cập nhật trạng thái đơn hàng
router.put('/:id/status', updateOrderStatus)

// Cập nhật toàn bộ đơn hàng (khách hàng, sản phẩm, số lượng, trạng thái)
router.put('/:id', updateOrder)

export default router
