import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'

export interface StockItem {
  product_id: number
  quantity: number
  import_price: number
}

export interface StockEntry {
  id: number
  entry_code: string
  entry_time: string
  supplier: string
  items?: StockItem[]
  items_detail?: string
}

interface StockState {
  entries: StockEntry[]
  loading: boolean
  error: string | null
}

const initialState: StockState = {
  entries: [],
  loading: false,
  error: null,
}

export const fetchStockEntries = createAsyncThunk('stock/fetchAll', async () => {
  const res = await api.get('/stock-entries')
  return res.data as StockEntry[]
})

export const createStockEntry = createAsyncThunk(
  'stock/create',
  async (data: { supplier: string; items: StockItem[] }) => {
    const res = await api.post('/stock-entries', data)
    return res.data as StockEntry
  }
)

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockEntries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStockEntries.fulfilled, (state, action: PayloadAction<StockEntry[]>) => {
        state.loading = false
        state.entries = action.payload
      })
      .addCase(fetchStockEntries.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Lỗi tải phiếu nhập kho'
      })
      .addCase(createStockEntry.fulfilled, (state, action: PayloadAction<StockEntry>) => {
        state.entries.unshift(action.payload)
      })
      .addCase(createStockEntry.rejected, (state, action) => {
        state.error = action.error.message || 'Lỗi tạo phiếu nhập kho'
      })
  },
})

export default stockSlice.reducer