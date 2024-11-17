import * as React from "./react";
import { Counter } from "./counter";

export const App = () => {

  const [initialCount, setInitialCount] = React.useState(Math.random())

  return (
    <div>
      <Counter initialCount={initialCount} onChange={console.log} />
      <button onClick={() => setInitialCount(Math.round(Math.random() * 10))}>Randomize</button>
    </div>
  )
}
