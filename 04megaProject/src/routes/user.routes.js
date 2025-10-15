import {Router} from 'express'
import { loginUser, logoutUser , refreshAccessToken, registerUser} from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'


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

router.route('/login').post(loginUser)


// secured routes ( jismein user logged in hona chahiye)
router.route("/logout").post(verifyJWT,logoutUser)
router.route('/refresh-token').post(refreshAccessToken)

export default router