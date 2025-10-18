import {Router} from 'express'
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser , refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage} from '../controllers/user.controller.js'
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
router.route('/change-password').post(verifyJWT,changeCurrentPassword)
router.route('/current-user').get(verifyJWT,getCurrentUser)

// we are using patch taki sab na update ho
router.route('/update-account').patch(verifyJWT,updateAccountDetails)
router.route('/change-avatar').patch(verifyJWT,upload.single('avatar'),updateUserAvatar)
router.route('/change-coverimg').patch(verifyJWT,upload.single('coverImage'),updateUserCoverImage)


// params wale route
router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)

router.route('/watch-history').get(verifyJWT,getWatchHistory)
export default router