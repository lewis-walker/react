import { useState, useEffect, useRef } from "./react";
import { Counter } from "./counter";

const isPrime = (num: number) => {
  for (let i = 2; i < num; i++) if (num % i === 0) return false
  return num > 1
}

const useCounter = (interval: number) => {
  const [count, setCount] = useState(1)

  useEffect(() => {
    console.log('useCounter effect')
    const id = setInterval(() => setCount(count => count + 1), interval)
    return () => { console.log('clearing interval'); clearInterval(id) }
  }, [])

  return count
}

export const App = () => {

  const [initialCount, setInitialCount] = useState(Math.round(Math.random() * 10))
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
  console.log('Outside effect: buttonElement', buttonElement)

  useEffect(() => {
    console.log('Inside effect: buttonElement', buttonElement)
  }, [buttonElement])

  return (
    <div>
      <div>{count}</div>
      <Counter initialCount={initialCount} onChange={console.log} />
      <button ref={buttonRef} onClick={() => setInitialCount(Math.round(Math.random() * 10))}>Randomize</button>
      <p>{message}</p>
    </div>
  )
}
