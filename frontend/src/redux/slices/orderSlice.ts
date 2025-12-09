import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'

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

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (search: string = '') => {
    const res = await api.get('/orders', { params: { search } })
    return res.data as Order[]
  }
)
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

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }: { id: number; status: 'pending' | 'completed' | 'cancelled' }) => {
    const res = await api.put(`/orders/${id}/status`, { status })
    return res.data as Order
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

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
