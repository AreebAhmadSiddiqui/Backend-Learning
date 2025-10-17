import mongoose from 'mongoose';
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


// Password change
const changeCurrentPassword=asyncHandler(async (req,res)=>{

    const {oldPassword,newPassword}=req.body

    const user= await User.findById(req.user?._id)

    const isPassValid=await user.isPasswordCorrect(oldPassword)

    if(!isPassValid) throw new ApiError(400,'Invalid old password')
    
    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password Changed Successfully"))
})



// get Current User
const getCurrentUser=asyncHandler(async (req,res)=>{

    // Hamne auth middleware mein user inject kar diya tha req mein hi
    return res
    .status(200)
    .json(200,req.user,"Current user fetched successfully")
})


// update account details
const updateAccountDetails=asyncHandler(async (req,res)=>{

    const {fullName,email} = req.body

    if(!fullName || !email) throw new ApiError(400,"All fields are required")
    
    const userId=req.user?._id

    const updatedUser=User.findByIdAndUpdate(
        userId,
        {
            $set:{
                fullName:fullName,
                email:email
            }
        },
        {new:true} // ye naya updated wala user dega
    ).select("-password")


    return res
    .status(200)
    .json(new ApiResponse(200,updatedUser,"User Updated Successfully"))
})

// Files update

// update userAvatar
const updateUserAvatar=asyncHandler(async (req,res)=>{

    // get the path of avatar
    const avatarLocalPath= req.file?.path
    
    if(!avatarLocalPath) throw new ApiError(400,'Avatar file is missing')

    const uploadedAvatar= await uploadOnCloudinary(avatarLocalPath)

    if(!uploadedAvatar) throw new ApiError(400,"Error while uploading on avatar")

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: uploadedAvatar.url
            }
        },
        {new:true}
    ).select('-password')

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Avatar Updated Successfully"))
})

// update user cover image
// update user Cover Image
const updateUserCoverImage=asyncHandler(async (req,res)=>{

    // get the path of coverImage
    const coverImageLocalPath= req.file?.path
    
    if(!coverImageLocalPath) throw new ApiError(400,'Cover file is missing')

    const uploadedCoverImg= await uploadOnCloudinary(coverImageLocalPath)

    if(!uploadedCoverImg) throw new ApiError(400,"Error while uploading on Cover Image")

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: uploadedCoverImg.url
            }
        },
        {new:true}
    ).select('-password')

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Cover Image Updated Successfully"))
})


// User profile page ( subscriber, subscribed wo wala page)

const getUserChannelProfile = asyncHandler(async (req,res)=>{
    const {username} = req.params

    if(!username?.trim()) throw new ApiError(400,"Username is missing")

    // aggregation piplines   

    // normally array return hota hai
    const aggregatedChannel = await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            // array diya
            $lookup:{ // sirf document aya hai abhi
                from:'subscriptions',  // subscriptions model se
                localField:'_id', // channel ki ID
                // wo documents jinmein channel current banda hai
                foreignField:'channel',  // subscriptions mein channel field
                as: 'subscribers'  // output array ka naam
            }
        },

        // kuch aisa hoga

        // {
        //   _id: "channel123",
        //   name: "Tech Channel",
        //   subscribers: [                    // Yeh array $lookup se aaya
        //     { subscriber: "user1" },
        //     { subscriber: "user2" }, 
        //     { subscriber: "user3" }
        //     // ...
        //   ]
        // }
        {
            // array diya
            $lookup:{  // sirf document aya hai abhi
                from:'subscriptions',
                localField:'_id',
                // wo documents jinmein subscriber current banda hai
                foreignField:'subscriber',
                as: 'subscribedTo'
            }
        },
        // Add these values to the document ( additional fields) ( count ke saath)
        {
            $addFields:{
                subscribersCount:{
                    // count karne ke liye
                    $size: '$subscribers'
                },
                channelSubscribedToCount:{
                    $size: '$subscribedTo'
                },
                isSubscribed:{
                    $cond: {
                        // ab ham dekh rha kya ye req.user wala banda is subscribers.subscriber array main hai ya nahi
                        if: {$in: [req.user?._id,'$subscribers.subscriber']},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            // Jab specific cheezein deni ho
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelSubscribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1,
                email
            }
        }

    ])

    // console.log(aggregatedChannel);

    if(!aggregatedChannel?.length){
        throw new ApiError(404,"Channel Does not Exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,aggregatedChannel[0],"User channel fetched successfully")
    )
})


// Watch History
const getWatchHistory = asyncHandler ( async (req,res)=>{
    const user= await User.aggregate([
        {   
            // user find karo
            $match:{
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup:{
                from: 'videos',
                localField:'watchHistory',
                foreignField:'_id',
                as : 'watchHistory',

                // sub piplines
                pipeline:[
                    {
                        $lookup:{
                            from:'users',
                            localField:'owner',
                            foreignField:'_id',
                            as : 'owners',

                            // Main owner wala data le to aya lekin sab ni chahiye bas ye 3 cheezein hi chahiye to ye de do
                            pipeline:[
                                {
                                    $project:{
                                        fullName:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },

                    // purely optional
                    {
                        $addFields:{
                            owner:{
                                // first element
                                $first: '$owner'
                            }
                        }
                    }
                ]
            }
        }
    ])


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fethced successfully"
        )
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    updateAccountDetails,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}