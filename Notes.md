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