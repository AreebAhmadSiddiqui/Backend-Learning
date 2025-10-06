import express from 'express'

const app = express()

const port = process.env.PORT || 4000

// app.get('/',(req,res)=>{
//     res.send(`<h1>Your App is running on ${port}</h1>`)
// })

app.get('/api/jokes',(req,res)=>{
    const jokes=[
        {
            id:1,
            title:'joke 1',
            desc:'this is joke 1'
        },
        {
            id:2,
            title:'joke 2',
            desc:'this is joke 2'
        },
        {
            id:3,
            title:'joke 3',
            desc:'this is joke 3'
        },
        {
            id:4,
            title:'joke 4',
            desc:'this is joke 4'
        },
        {
            id:5,
            title:'joke 5',
            desc:'this is joke 5'
        },
    ]

    res.send(jokes)
})

app.listen(port,()=>{
    console.log(`App listening on Port ${port}`);
})