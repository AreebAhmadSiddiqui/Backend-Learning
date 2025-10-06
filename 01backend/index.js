require('dotenv').config()
const express = require('express')

// apka server ban gya app namse
const app = express()

// server hamara listen karega ( hawa mein to karega ni kahin listen ho rha hoga to wo batata hai port)
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('<h1>Your First Server Congrats</h1>')
})

app.get('/twitter' ,(req,res)=>{
    res.send("areebahmadsiddiqui")
})

app.get('/login' ,(req,res)=>{
    res.send("<h2>Please Login</h2>")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
