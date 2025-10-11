import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// Setting up cors

// app.use(cors()) // kaam to ho gaya lekin aur bhi options hote hai
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Adding configurations ( Data multiple source se aega isliye kuch settings banaenge)
app.use(express.json({limit:'16kb'}))

// URL se data ( URL mein cheezein badalte rahte hai //, %20 for space etc to in sab ko encode karke batana padta hai)
app.use(express.urlencoded({extended:true,limit:'16kb'}))


// for static files like favicon,img jo main apne server mein hi store karna chahta hun
app.use(express.static("public"))


// for performing crud operations on the users cookies
app.use(cookieParser())


//ROUTES

//routes import
import userRouter from './routes/user.routes.js'

// routes declaration ( app.get ni likhre dyan se)
app.use('/api/v1/users',userRouter)
// http://localhost:8000/api/v1/users/register

export default app