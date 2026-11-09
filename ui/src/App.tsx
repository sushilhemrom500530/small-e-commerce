import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
          <p className="text-lg">This is a simple React application.</p>
          <button
            onClick={() => setCount(count + 1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Click me: {count}
          </button>
        </div>
      </div>
    </>
  )
}

export default App
