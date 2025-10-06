require('dotenv').config()
const express = require('express')

// apka server ban gya app namse
const app = express()

// server hamara listen karega ( hawa mein to karega ni kahin listen ho rha hoga to wo batata hai port)
const port = process.env.PORT

const githubData = {
  "login": "AreebAhmadSiddiqui",
  "id": 87814983,
  "node_id": "MDQ6VXNlcjg3ODE0OTgz",
  "avatar_url": "https://avatars.githubusercontent.com/u/87814983?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/AreebAhmadSiddiqui",
  "html_url": "https://github.com/AreebAhmadSiddiqui",
  "followers_url": "https://api.github.com/users/AreebAhmadSiddiqui/followers",
  "following_url": "https://api.github.com/users/AreebAhmadSiddiqui/following{/other_user}",
  "gists_url": "https://api.github.com/users/AreebAhmadSiddiqui/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/AreebAhmadSiddiqui/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/AreebAhmadSiddiqui/subscriptions",
  "organizations_url": "https://api.github.com/users/AreebAhmadSiddiqui/orgs",
  "repos_url": "https://api.github.com/users/AreebAhmadSiddiqui/repos",
  "events_url": "https://api.github.com/users/AreebAhmadSiddiqui/events{/privacy}",
  "received_events_url": "https://api.github.com/users/AreebAhmadSiddiqui/received_events",
  "type": "User",
  "user_view_type": "public",
  "site_admin": false,
  "name": "Areeb Ahmad Siddiqui",
  "company": null,
  "blog": "",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": null,
  "twitter_username": null,
  "public_repos": 29,
  "public_gists": 0,
  "followers": 3,
  "following": 1,
  "created_at": "2021-07-22T13:02:16Z",
  "updated_at": "2025-09-22T12:44:20Z"
}

app.get('/', (req, res) => {
  res.send('<h1>Your First Server Congrats</h1>')
})

app.get('/twitter' ,(req,res)=>{
    res.send("areebahmadsiddiqui")
})

app.get('/login' ,(req,res)=>{
    res.send("<h2>Please Login</h2>")
})

app.get('/github',(req,res)=>{
    res.json(githubData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
