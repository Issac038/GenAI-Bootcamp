import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <form action="submit">
          <input type="text" placeholder='Username' name="Username"  />
          <br />
          
          <input type="password" name="Password" placeholder='Password' />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  )
}

export default App
