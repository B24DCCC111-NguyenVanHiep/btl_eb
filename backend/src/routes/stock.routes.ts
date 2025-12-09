import { Router } from 'express'
import { getStockEntries, createStockEntry } from '../controllers/stockController'

const router = Router()

router.get('/', getStockEntries)
router.post('/', createStockEntry)

export default router