import {Router} from 'express'
import registerUser from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'


const router= Router()

// yahan pe after localhost:8000/api/v1/users/{routes}
router.route('/register').post(

    // ye middleware ka use ( jane se pehle mil ke jana )
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

export default router