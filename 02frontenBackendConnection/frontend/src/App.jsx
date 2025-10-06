import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import Joke from './Joke'
function App() {
  const [jokes, setJokes] = useState([])

  useEffect(() => {

    async function getJokes() {
      try {
      const data = await axios.get('/api/jokes')
      console.log(data.data);
      setJokes(data.data)
      
    } catch (error) {
      console.log(error);
    }
    }
    getJokes()
  }, [])

  const Jokes=jokes.map((joke)=>(
    <Joke joke={joke}/>
  ))
  return (
    <div>
      <h1>Frontend+Backend</h1>
      <p>Jokes: {jokes.length}</p>
      {Jokes}
      <h3>Footer</h3>
    </div>
  )
}

export default App
