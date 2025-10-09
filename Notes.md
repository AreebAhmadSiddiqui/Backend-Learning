# Lession 1 ( What is backend? )

- Backend development woh kaam hai jo website ya app ke "parde ke peeche" (behind the curtains) hota hai. Jab aap koi app use karte hain, jo kuch bhi aapko dikhta nahi hai, par kaam karwata hai, woh sab backend hai.

- Jaise Sochiye: Aap Zomato app kholte ho. Aapko restaurants dikhte hain, menu dikhta hai. Yeh sab Frontend hai (jo aap dekhte ho).
- Lekin jab aap koi dish search karte ho, toh woh data kahan se aata hai? Aapka order kaise save hota hai? Payment kaise process hoti hai? Aapko notification kaise aata hai? Yeh sab Backend ka kaam hai.
- Backend Developer Kya Karta Hai? (Backend ka Kaam)
Ek backend developer mainly teen cheezein banata aur manage karta hai:

1. **Server (The Machine)**

- Yeh ek powerful computer hai jo hamesha internet se connected rehta hai.
- Isi par aapka app/website ka code host hota hai.
- Backend developer is server ko manage karta hai ki woh efficiently kaise kaam kare.

2. **Application (The Business Logic)**

Yeh woh code hai jismein aapke app ka asli dimag (logic) hota hai.

Examples:

- "Agar user 'Login' button dabaye, toh uska email aur password database se check karo."
- "Agar user ne product 'Add to Cart' kiya, toh us product ko uske cart mein daalo."
- "User ne jo city search ki hai, us city ke saare restaurants dikhao."
- Iske liye programmers languages use karte hain jaise: Python, Java, PHP, C#, Node.js (JavaScript ka backend version), Ruby, Go.

3. **Database (The Storage)**

- Yeh ek organized tarika hai saari information ko store karne ka.
- Isi mein users ka data (name, email, password), products ki details, orders ki history, sab kuch save rehta hai.
- Examples: MySQL, PostgreSQL, MongoDB, Firebase.
- Backend developer decide karta hai ki data kaise store hoga aur phir need padne par kaise retrieve kiya jaayega.

![Backend-Architecture](./images/backend-archi.png)

**Note - DB hamesha doosre continent mein hota hai**


### JS Based backend

- You will handle data, file and third party ( API )
- A JS runtime : NodeJS/Deno/Bun

#### Directory Structure

- src has index( DB connection),  APP( configuration , cookies, urlencoder) , constants ( enums, DB-name )
- DB - Database connection code
- Models - Sample of your db table
- Controllers - Functionality
- Routes - Routing of ur api
- Middleware - 
- Utils - File upload, email sending ( utilities )
- More ( depends )

![directory-structure](./images/directory-structure.png)

# Lession 2 ( Simple Project )

### Express JS

- Express.js (or simply Express) is the most popular Node.js web application framework, designed for building web applications and APIs.
- It's often called the de facto standard server framework for Node.js.

Key Characteristics:

- Minimal and flexible
- Unopinionated (you decide how to structure your app)
- Lightweight and fast
- Extensible through middleware
- Huge ecosystem of plugins and extensions

Two ways of importing files

- const express = require('express') ( CommonJS)
- import express from 'express' (Module)
- Kabhi kabhi issue ata hai to package.json mein jake 'type' key bana do ( module ya commonjs value ke saath)

### CORS Issue

- Ya to whitelist kardo backend mein
- Ya proxy laga do - wo har bundler ke liye alag step hoga 
- proxy kya karta hai 

```jsx

server: {
    proxy: {
      '/api' : 'http://localhost:4000'
    }
  }

- agar koi request /api se shuru hoti hai to uske age automatically http://localhost:4000 ye  lag jaega
- to server ko lagega ki ye to same origin se request a rhi hai to data de dega

- Hamara backend runs on port 4000 and frontend on 3000

Browser Request: http://localhost:4000/api/users
    ↓
Proxy Intercepts: "Aha! '/api' dekha!"
    ↓
Redirects to: http://localhost:4000/api/users
    ↓
Backend Response: JSON data
    ↓
Proxy Returns: Same data to frontend

```

# Lession 3 ( How backend is started? )

- Sabse pehle data kaise store ho rha hai backend mein uski chinta karo
- sketch out the fields you want in your db ( frontend wagerah ban jaega )
- Sabse pehle data modelling karo

![data-model](./images/data-model.png)

- Ise data ko model karne ke liye **mongooses** use karte

#### Data Modelling best practices

- Create a models folder 
- Then create a folder for your model
- Then Create a model using this naming convention (model_name.models.js) not compulsory but good to write like this


```javascript
// Step 1 import mongoose
import mongoose from "mongoose";

// Step 2 create a schema
const userSchema = new mongoose.Schema({})

// Step 3 export this schema ( create a model)
export const User=mongoose.model("User",userSchema)
```

- **Note : mongoDB mein users naam se store hoga ( lowercase + s lag jata hai)**


### Foreign key reference in mongoose

```jsx
createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subTodos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubTodo'
        }
    ]// Array of subtodos
```

### Images

- Store them somewhere in the cloud and get the url
- you can store images directly too but not recommended

### Agar limited options chahiye

```jsx
// Limited options
    status:{
        type: String,
        enum: ['PENDING',"CANCELLED","DELIVERED"],
        default: 'PENDING'
    }
```


# Lession 4 ( Mega Project Starts )

- to push empty folders to git use .gitkeep(an empty file) inside the folder
- **nodemon** - server ko restart kr deta hai changes mein
- lekin use nodemon as dev dependency ( production mein ni jaega)
- **Prettier** - Ye common syntax bana deta hai code ka , jaise single qutoe use ni honge, spaces two tabs ki hongi etc etc
- Jisse team same page pe rahti hai
- create two files .prettierrc ( config file) and .prettierignore ( files where you dont want prettier to do anything (Ex- node modules , .env etc))

### DB connectivity

TWO MOST IMPORTANT THINGS TO NOTE

- DB operations should always be wrapped inside **try catch**
- DB is another continent so use **async await** ( basically treat it as asynchronous code)

Two ways of connecting

1) first file mein jo load hogi ( index app whatever usi mien db connect kardo)

```javascript
';' kyun JS ko batane ke liye semicolon ke baad naya cheeze shuru hui hai
agar ni hota to isse ata read karna ho to notes padhna wahan hai iska concept

- Han function banake function ko call bhi kar sakte ho iife agar na use karna ho

;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on('error',(error)=>{
            console.log("APP not able to talk to mongo ERROR: ",error);
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${PORT}`)
        })
    } catch (error) {
        console.log("Error:",error);
        throw error
    }
})()


```

2. Alag db folder banake usmein se karo jo karna hai

```javascript

dbConnection.js

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () =>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

        // console.log(connectionInstance);
        
        console.log(`\n MongoDB connected !! DB Host ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB connection error",error);
        throw error

        // or you can use process.exit(1)
    }
}

export default connectDB

index.js

// require('dotenv').config({path: './env'})

import dotenv from 'dotenv'
import connectDB from './db/index.js'

dotenv.config({ path: './.env' })

connectDB()
```

**NOTE:**

- dotenv ko sabse pehle load karo jaise kiya hai
- path de do ki kahan se env lena


### Setting Configurations 

- we use app.use() for middlewares and any cofigurations modification
- async await hamesha return value promise mein wrap karke return karta hai
- **Setting up cors**

    // **app.use(cors())** // kaam to ho gaya lekin aur bhi options hote hai
    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }))

- **Adding configurations** 
    1. ( Data multiple source se aega isliye kuch settings banaenge)
    2. Rate limiting bhi add karenge
    3. **express.json()** middleware request body mein se JSON data parse karta hai 
    4. URL se data ( URL mein cheezein badalte rahte hai //, %20 for space etc to in sab ko encode karke batana padta hai)
    **app.use(express.urlencoded({extended:true,limit:'16kb'}))**
    
        ismein extended ki madad se obj ke andar obj bhej paenge
    aur limit to samjh gae hoge

    5. For static files like favicon,img jo main apne server mein hi store karna chahta hun
    **app.use(express.static("public"))**
    
        yaad karo public folder banaya hai isliye banaya hai
    6. cookiParser is used to perform CRUD operations on the cookies of the user's browser
    **app.use(cookieParser)**


### Middlewares

- Middleware ek aisa "bridge" ya "gatekeeper" hota hai jo request aane se pehle aur response jaane se pehle beech ka kaam karta hai.

Socho aap ek restaurant mein order de rahe ho:

Normal Flow:

- Aap order karte ho (Client Request)
- Waiter kitchen mein order lekar jaata hai
- Chef khana banata hai (Server Process)

- Waiter khana laake deta hai (Server Response)

Middleware wala Flow:

- Aap order karte ho (Request)

Waiter check karta hai:

- Kya aapne table book kiya hai? (Authentication Middleware)
- Kya aap VIP customer ho? (Authorization Middleware)
- Kya order sahi format mein hai? (Validation Middleware)
- Order ko notepad mein likhta hai (Logging Middleware)
- Fir hi kitchen mein order bhejta hai

Khana banne ke baad bhi waiter:

- Presentation check karta hai (Formatting Middleware)
- Bill add karta hai (Processing Middleware)
- Tab jaake khana aapko milta hai (Response)