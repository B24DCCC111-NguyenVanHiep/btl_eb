import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'

export interface Customer {
  id: number
  code: string
  full_name: string
  birth_year: number
  address: string
  phone?: string
}

interface CustomerState {
  customers: Customer[]
  loading: boolean
  error: string | null
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
}

// --- Async Thunks ---

export const fetchCustomers = createAsyncThunk('customers/fetchAll', async () => {
  const res = await api.get('/customers')
  return res.data as Customer[]
})

export const addCustomer = createAsyncThunk(
  'customers/add',
  async (customer: Omit<Customer, 'id'>) => {
    const res = await api.post('/customers', customer)
    return res.data as Customer
  }
)

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, customer }: { id: number; customer: Partial<Customer> }) => {
    const res = await api.put(`/customers/${id}`, customer)
    return res.data as Customer
  }
)

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/customers/${id}`)
      return id
    } catch (err: unknown) {
      // Kiểm tra lỗi để lấy message
      if (err instanceof Error) {
        return rejectWithValue(err.message)
      } else {
        return rejectWithValue('Lỗi xóa khách hàng')
      }
    }
  }
)

// --- Slice ---

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
        state.loading = false
        state.customers = action.payload
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Lỗi tải khách hàng'
      })
      .addCase(addCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.customers.push(action.payload)
      })
      .addCase(updateCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id)
        if (index !== -1) state.customers[index] = action.payload
      })
      .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<number>) => {
        state.customers = state.customers.filter(c => c.id !== action.payload)
      })
  },
})

export default customerSlice.reducer
