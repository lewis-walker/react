import { LoggingProvider } from "./logging-provider";
import { useState, useEffect } from "./react";
import * as React from './react'

export type CounterProps = {
    initialCount: number;
    onChange: (count: number) => void;
}

export const Counter = ({ initialCount, onChange }: CounterProps) => {
    const [count, setCount] = useState(initialCount);
    const logger = React.useContext(LoggingProvider)

    useEffect(() => {
        setCount(initialCount);
    }, [initialCount]);

    const handleIncrement = () => {
        logger.log('Incrementing count');
        setCount(count + 1);
        onChange(count + 1);
    }

    const handleDecrement = () => {
        logger.log('Decrementing count');
        setCount(count - 1);
        onChange(count - 1);
    }

    return (
        <div>
            <p>{count}</p>
            <button onClick={handleIncrement}>Increment</button>
            <button onClick={handleDecrement}>Decrement</button>
        </div>
    )
}