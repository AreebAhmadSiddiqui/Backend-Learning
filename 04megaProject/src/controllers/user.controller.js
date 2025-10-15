import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken'

// Generate access and refreshtoken

const generateAccessAndRefreshToken = async ( userId) => {
    try{
        const user = await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        // save the refresh token to db
        user.refreshToken=refreshToken

        // Isse koi validation ni hoga seedha jake save ho jaega
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}


    }catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

// Register User
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

// Login User
const loginUser = asyncHandler( async (req,res)=>{

    // - req body se data lo
    const {email,username,password}=req.body

    if(!username && !email) throw new ApiError(400,"username or email is required")


    // - username or email se find karo user
    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user) throw new ApiError(404,"User doesn't exist")

    // - password check karo
    const isPassValid= await user.isPasswordCorrect(password)
    if(!isPassValid)  throw new ApiError(401,"Password incorrect")

    // - generate access and refresh token
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    // - send secure cookies
    
    // upar wala bhi to user le sakte the 
    // Hn lekin usmein refresh token dalke kaam karna padta kyunki user pehle wala tokens banne se pehle liya tha na isliye ni samjhe??
    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

    // cookie options

    // in dono se frontend se koi cookies mein changes ni kar sakta
    const options = {
        httpOnly : true,
        secure: true
    }
    
    // return the response
    return res
    .status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json(
        new ApiResponse(200,{
            user: loggedInUser,accessToken,refreshToken
        },"User Logged in Successfully")
    )
})

// Logout User
const logoutUser = asyncHandler( async (req,res)=>{

    // lekin is route mein req mein tum user ki detail to bhejoge ni???
    // Ye access kaise mila tumhare middleware se jo tumne lagaya hai routes mein
    // uski last mein req mein add kiya hai na

    const userId = req.user._id

    const updatedUser = User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: undefined

                //undefined se field hat jaegi
                //null se field rahegi without data
            }
        },
        {
            new: true
        }
    )


    // ek aur variation hai ( best Practice)

    const _updatedUser = await User.findByIdAndUpdate(
    userId,
    { $unset: { refreshToken: 1 } },
    { new: true } // ✅ Updated document return karega
    );

    // What does new do
    // console.log(updatedUser);
    // Output: { _id: "123", name: "John", email: "john@example.com" }
    // ❌ refreshToken field nahi hogi


    const options = {
        httpOnly : true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json(new ApiResponse(200,{},"User Logged Out"))
})


// access token refresh karne ke liye
const refreshAccessToken = asyncHandler(async (req,res) => {
    // get the refresh token
    const incomingRefreshToken = req.cookies.refreshToken || 
    res.body.refreshToken // for mobile

    if(!incomingRefreshToken) throw new ApiError(401,"Unauthorized Request")

    try {
        // verify token
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        // Get the user
        const userId = decodedToken?._id
        const user= await User.findById(userId)
    
        if(!user) throw new ApiError(401,"Invalid Refresh Token")
    
        
        // Check if the refresh token is still valid 
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        // All verifications done
        // Generate new Tokens
    
        const options = {
            httpOnly: true, // javascript se access ni
            secure:true // only https request
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user?._id)
    
        return res
        .status(200)
        .cookie('accessToken',accessToken,options)
        .cookie('refreshToken',newRefreshToken,options)
        .json(new ApiResponse(
            200,
            {accessToken,refreshToken: newRefreshToken},
            "Access token refreshed"
        ))
    } catch (error) {
        throw new ApiError(401,error?.message || "Some issue in refreshing the access token")
    }
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}