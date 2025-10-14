import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from '../models/user.models.js';

// Verify whether there is user or not
export const verifyJWT = asyncHandler( async (req,res,next) => {

    try {
        // req main cookie kaise laga pa rhe?
        // kyunki hamne app mein wo middleware dal diya hai cookie parse wala ( req aur res dono mein access hai)
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    
    
        if(!token) throw new ApiError(401,'Unauthorized request')
        
        // Agar token hai JWT se check bhi karna hai
    
        const decodedTokenInfo = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedTokenInfo?._id).select('-password -refreshToken')
    
        if(!user) {
    
            // Todo
            throw new ApiError(401,'Invalid Access Token')
        }
    
        // add user to req
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})