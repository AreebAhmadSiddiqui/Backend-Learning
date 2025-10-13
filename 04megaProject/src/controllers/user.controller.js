import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js';

const registerUser = asyncHandler( async (req,res)=>{
    // res.status(200).json({
    //     message:'areeb ahmad'
    // })

    // get user details from frontend ( postman in our case)
    // validation ( VV imporant ) - not empty ek example
    // check if user already exists : username, email
    // check if images,check for avatar
    // upload to cloudinary , check for avatar for sure
    // get the url
    // create user object - and create entry in the db 
    // check for user creation ( properly create hua ki ni)
    // remove password and refresh token field from response and give it back to frontend
    // return res


    // Validation ( yahan ek hi likha tum aur bhi likh sakte )

    // Step 1
    const {fullName,email,username,password}=req.body
    console.log('email: ',email );

    // Step 2
    if ([fullName,email,username,password].some((field)=> field?.trim()==='')){
        throw new ApiError(400,"All fields are mandatory")
    }

    // Step 3 Check for uniqueness
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    
    if(existedUser) throw new ApiError(409,"User with email or username already exists")

    // Files
    // multer hame req.files ka option de deta hai

    const avatarLocalPath= req.files?.avatar[0]?.path
    // const coverImageLocalPath= req.files?.coverImage[0]?.path

    if(req.files){
        console.log("avatar local path",avatarLocalPath);
        console.log(req.files.avatar[0]);
    }
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    // Step 4 Check for avatar
    if(!avatarLocalPath) throw new ApiError(400,"Avatar is required")

    // Step 5 Upload them to cloudinary

    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImg=await uploadOnCloudinary(coverImageLocalPath)

    // console.log(avatar);
    

    // Step 6 ( Check for avatar upload)

    if(!avatar) throw new ApiError(400,"Avatar not uploaded successfully")

    // Step 7 ( Add the User Object into DB)

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        // cover image hogi ya ni iski guarantee to hai ni isliye ye kiya
        coverImage: coverImg?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // Step 8 & 9 ( Check if user is perfectly created ( Remove pass and refresh token))
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser) throw new ApiError(500,"Something went wrong while creating user")

    // Step 10
    
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User added Successfully")
    )

})

export default registerUser