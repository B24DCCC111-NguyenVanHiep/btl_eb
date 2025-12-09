// import { Router } from 'express'
// import {
//   getCustomers,
//   addCustomer,
//   updateCustomer,
//   deleteCustomer
// } from '../controllers/customerController'

// const router = Router()

// router.get('/', getCustomers)
// router.post('/', addCustomer)
// router.put('/:id', updateCustomer)
// router.delete('/:id', deleteCustomer)

// export default router



import { Router } from 'express'
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer 
} from '../controllers/customerController'

const router = Router()

router.get('/', getCustomers)
router.post('/', addCustomer)
router.put('/:id', updateCustomer)
router.delete('/:id', deleteCustomer)  

export default router
