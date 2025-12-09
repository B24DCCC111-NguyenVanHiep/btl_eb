import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import customerRoutes from './routes/customer.routes'
import orderRoutes from './routes/order.routes'
import stockRoutes from './routes/stock.routes'
import dashboardRoutes from './routes/dashboard.routes' 

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/stock-entries', stockRoutes)
app.use('/api/dashboard', dashboardRoutes) 

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`Backend chạy tại http://localhost:${PORT}`)
})