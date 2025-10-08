// require('dotenv').config({path: './env'})

import dotenv from 'dotenv'
import connectDB from './db/index.js'
import app from './app.js'

dotenv.config({ path: './.env' })

// async await function hamesha return value promise mein wrap karke bhejta hai
connectDB()
.then(()=>{
    const port=process.env.PORT || 8000
    app.listen(port, ()=>{
        console.log(`Server is listening on Port ${port}`);
    })
})
.catch((err)=>{
    console.log('DB connection error',err);
})



// APPROACH 1


// ; kyun JS ko batane ke liye semicolon ke baad naya cheeze shuru hui hai
// agar ni hota to isse ata read karna ho to notes padhna wahan hai iska concept
// Han function banake function ko call bhi kar sakte ho iife agar na use karna ho

// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on('error',(error)=>{
//             console.log("APP not able to talk to mongo ERROR: ",error);
//             throw error
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on port ${PORT}`)
//         })
//     } catch (error) {
//         console.log("Error:",error);
//         throw err
//     }
// })()

