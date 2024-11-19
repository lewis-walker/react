import { useState, useEffect, useRef } from "./react";
import * as React from './react'
import { Counter } from "./counter";
import { LoggingProvider } from "./logging-provider";

const isPrime = (num: number) => {
  for (let i = 2; i < num; i++) if (num % i === 0) return false
  return num > 1
}

const useCounter = (interval: number) => {
  const [count, setCount] = useState(1)

  useEffect(() => {
    const id = setInterval(() => setCount(count => count + 1), interval)
    return () => { console.log('clearing interval'); clearInterval(id) }
  }, [interval])

  return count
}

export const App = () => {
  const [initialCount, setInitialCount] = useState(Math.ceil(Math.random() * 10))
  const [message, setMessage] = useState("")

  const buttonRef = useRef<HTMLButtonElement>()
  const count = useCounter(1000)

  useEffect(() => {
    if (isPrime(initialCount)) {
      setMessage("Initial count is prime")
      return () => console.log("cleanup")
    } else {
      setMessage("")
    }
  }, [initialCount])

  const buttonElement = buttonRef.current

  useEffect(() => {
    console.log('Inside effect: buttonElement', buttonElement)
  }, [buttonElement])

  return (
    <LoggingProvider.Provider value={console}>
      <div>Counter: {count}</div>
      <div style="display: flex; align-items: baseline">
        Value:&nbsp;<Counter initialCount={initialCount} onChange={console.log} />
      </div>
        <button ref={buttonRef} onClick={() => { setInitialCount(Math.ceil(Math.random() * 10))}}>Randomize</button>
        <p>{message}</p>
    </LoggingProvider.Provider>
  )
}
