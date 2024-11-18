import * as React from "./react";
import { useState, useEffect, useRef } from "./react";
import { Counter } from "./counter";

const isPrime = (num: number) => {
  for (let i = 2; i < num; i++) if (num % i === 0) return false
  return num > 1
}

export const App = () => {

  const [initialCount, setInitialCount] = useState(Math.round(Math.random() * 10))
  const [message, setMessage] = useState("")

  const buttonRef = useRef<HTMLButtonElement>()

  useEffect(() => {
    if (isPrime(initialCount)) {
      setMessage("Initial count is prime")
      return () => console.log("cleanup")
    } else {
      setMessage("")
    }
  }, [initialCount])

  const buttonElement = buttonRef.current
  console.log('Outside effect: buttonElement', buttonElement)

  useEffect(() => {
    console.log('Inside effect: buttonElement', buttonElement)
  }, [buttonElement])

  return (
    <div>
      <Counter initialCount={initialCount} onChange={console.log} />
      <button ref={buttonRef} onClick={() => setInitialCount(Math.round(Math.random() * 10))}>Randomize</button>
      <p>{message}</p>
    </div>
  )
}
