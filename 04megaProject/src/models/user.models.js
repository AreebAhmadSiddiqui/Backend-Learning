import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

        // for enabling searching field in an optimised way use this
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true
    },
    coverImage: {
        type: String, // cloudinary url
    },
    watchHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required: [true,'Password is required']
    },
    refreshToken:{
        type: String,
    }
},{timestamps:true})

// bhai time lagega obviously isliye async 
userSchema.pre('save', async function(next){
    // this → Current document jo save ho raha hai (user object)

    // this.isModified('password') → Check kar raha hai: kya password field change hua hai?

    // bcrypt.hash(this.password, 10) → Password ko hash kar raha hai with salt rounds 10

    // this.password = ... → Hashed password ko wapas assign kar raha hai

    if(this.isModified('password')) this.password= await bcrypt.hash(this.password,10)
    next()
})

// ye moongose schema mein custom method add karne ke liye
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}


// Tokens Generation

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




export const User= mongoose.model("User",userSchema)
