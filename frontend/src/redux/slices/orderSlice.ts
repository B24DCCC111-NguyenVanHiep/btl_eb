// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
// import api from '../../services/api'

// export interface OrderItem {
//   product_id: number
//   quantity: number
//   unit_price: number
// }

// export interface Order {
//   id: number
//   order_code: string
//   customer_id: number
//   purchase_time: string
//   total_amount: number
//   status: string
//   items: OrderItem[]
// }

// interface OrderState {
//   orders: Order[]
//   loading: boolean
//   error: string | null
// }

// const initialState: OrderState = {
//   orders: [],
//   loading: false,
//   error: null,
// }

// export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
//   const res = await api.get('/orders')
//   return res.data as Order[]
// })

// export const createOrder = createAsyncThunk(
//   'orders/create',
//   async (order: { customer_id: number; items: { product_id: number; quantity: number }[] }) => {
//     const res = await api.post('/orders', order)
//     return res.data as Order
//   }
// )

// const orderSlice = createSlice({
//   name: 'orders',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchOrders.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
//         state.loading = false
//         state.orders = action.payload
//       })
//       .addCase(fetchOrders.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.error.message || 'Lỗi tải đơn hàng'
//       })
//       .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
//         state.orders.unshift(action.payload) 
//       })
//       .addCase(createOrder.rejected, (state, action) => {
//         state.error = action.error.message || 'Lỗi tạo đơn hàng'
//       })
//   },
// })

// export default orderSlice.reducer







import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'

// --- Interfaces ---
export interface OrderItem {
  id?: number
  product_id: number
  quantity: number
  unit_price?: number
  product_name?: string
}

export interface Order {
  id: number
  order_code: string
  customer_id: number
  customer_name?: string
  purchase_time: string
  total_amount: number
  status: 'pending' | 'completed' | 'cancelled'
  items?: OrderItem[]
}

interface OrderState {
  orders: Order[]
  loading: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
}

// --- Async Thunks ---

// Lấy danh sách đơn hàng (có thể search)
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (search: string = '') => {
    const res = await api.get('/orders', { params: { search } })
    return res.data as Order[]
  }
)

// Tạo đơn hàng mới (✅ đã có status)
export const createOrder = createAsyncThunk(
  'orders/create',
  async (order: {
    customer_id: number
    items: { product_id: number; quantity: number }[]
    status: 'pending' | 'completed' | 'cancelled'
  }) => {
    const res = await api.post('/orders', order)
    return res.data as Order
  }
)

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }: { id: number; status: 'pending' | 'completed' | 'cancelled' }) => {
    const res = await api.put(`/orders/${id}/status`, { status })
    return res.data as Order
  }
)

// --- Slice ---
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Lỗi tải đơn hàng'
      })

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false
        state.orders.unshift(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Lỗi tạo đơn hàng'
      })

      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false
        const index = state.orders.findIndex(o => o.id === action.payload.id)
        if (index !== -1) state.orders[index] = action.payload
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Lỗi cập nhật trạng thái'
      })
  },
})

export default orderSlice.reducer
