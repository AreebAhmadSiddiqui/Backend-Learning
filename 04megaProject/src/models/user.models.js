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
    return jwt.sign(  // ✅ JWT token generate karta hai
        // PAYLOAD (Data that will be stored in token)
        {
            _id: this._id,        // Current user ki ID
            email: this.email,     // Current user ka email  
            username: this.username, // Current user ka username
            fullName: this.fullName  // Current user ka full name
        },
        // SECRET KEY (Signature verify karne ke liye)
        process.env.ACCESS_TOKEN_SECRET,
        // OPTIONS
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Token expiry time
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        // PAYLOAD (Minimal data)
        {
            _id: this._id,  // Sirf user ID
        },
        // DIFFERENT SECRET KEY  
        process.env.REFRESH_TOKEN_SECRET,
        // LONGER EXPIRY
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




export const User= mongoose.model("User",userSchema)
