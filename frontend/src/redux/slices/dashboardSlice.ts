import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Định nghĩa kiểu dữ liệu trả về từ API
interface DashboardStats {
  totalProducts: number
  totalCustomers: number
  totalOrders: number
  revenue: number
  totalStock: number
}

interface DashboardState {
  stats: DashboardStats
  loading: boolean
  error: string | null
}

const initialState: DashboardState = {
  stats: {
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    revenue: 0,
    totalStock: 0,
  },
  loading: false,
  error: null,
}

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    const response = await axios.get('http://localhost:5001/api/dashboard/stats')
    return response.data
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Lỗi tải thống kê'
      })
  },
})

export default dashboardSlice.reducer