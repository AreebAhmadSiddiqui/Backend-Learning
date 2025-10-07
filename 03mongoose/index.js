import express from 'express'

const app= express()
const PORT=process.env.PORT || 9000

app.get('/',(req,res)=>{
    res.send('Hi Express')
})

app.listen(PORT,()=>{
    console.log(`App is listening on port ${PORT}`);
})