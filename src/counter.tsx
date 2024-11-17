import * as React from "./react";
import { useState, useEffect } from "./react";

export type CounterProps = {
    initialCount: number;
    onChange: (count: number) => void;
}

export const Counter = ({ initialCount, onChange }: CounterProps) => {
    const [count, setCount] = useState(initialCount);

    useEffect(() => {
        setCount(initialCount);
    }, [initialCount]);

    const handleIncrement = () => {
        setCount(count + 1);
        onChange(count + 1);
    }

    const handleDecrement = () => {
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