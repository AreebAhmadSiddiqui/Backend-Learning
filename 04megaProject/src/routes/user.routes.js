import {Router} from 'express'
import registerUser from '../controllers/user.controller.js'

const router= Router()

// yahan pe after localhost:8000/api/v1/users/{routes}
router.route('/register').post(registerUser)

export default router 