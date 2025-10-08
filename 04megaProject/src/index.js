// require('dotenv').config({path: './env'})

import dotenv from 'dotenv'
import connectDB from './db/index.js'

dotenv.config({ path: './.env' })

connectDB()


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

