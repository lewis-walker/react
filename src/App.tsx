import * as React from "./react";
import { useState, useEffect } from "./react";
import { Counter } from "./counter";

const isPrime = (num: number) => {
  for (let i = 2; i < num; i++) if (num % i === 0) return false
  return num > 1
}

export const App = () => {

  const [initialCount, setInitialCount] = useState(Math.round(Math.random() * 10))
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (isPrime(initialCount)) {
      setMessage("Initial count is prime")
      return () => console.log("cleanup")
    } else {
      setMessage("")
    }
  }, [initialCount])

  return (
    <div>
      <Counter initialCount={initialCount} onChange={console.log} />
      <button onClick={() => setInitialCount(Math.round(Math.random() * 10))}>Randomize</button>
      <p>{message}</p>
    </div>
  )
}
