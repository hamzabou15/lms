"use client"
import { useEffect, useState } from "react";


export function useDebounce<T>(value: T, delay?: number): T {

    const [debounceValue, setDevounceValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDevounceValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debounceValue


} 