import React from 'react'

const Joke = ({joke}) => {
  return (
    <div key={joke.id}>
        <h3>{joke.title}</h3>
        <p>{joke.desc}</p>
    </div>
  )
}

export default Joke