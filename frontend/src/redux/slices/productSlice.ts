import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'

export interface Product {
  id: number
  code: string
  name: string
  price: number
  stock: number
  visible: boolean
  image_url?: string
}

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
}

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const res = await api.get('/products')
  return res.data as Product[]
})

export const addProduct = createAsyncThunk('products/add', async (product: Omit<Product, 'id' | 'visible'>) => {
  const res = await api.post('/products', product)
  return res.data as Product
})

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: number; data: Partial<Product> }) => {
    const res = await api.put(`/products/${id}`, data)
    return res.data as Product
  }
)

export const deleteProduct = createAsyncThunk('products/delete', async (id: number) => {
  await api.delete(`/products/${id}`)
  return id
})

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Lỗi' })
      .addCase(addProduct.fulfilled, (state, action) => { state.products.unshift(action.payload) })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id)
        if (index !== -1) state.products[index] = { ...state.products[index], ...action.payload }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload)
      })
  },
})

export default productSlice.reducer