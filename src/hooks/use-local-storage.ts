'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStored(JSON.parse(item));
    } catch {
      /* noop */
    }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    const next = value instanceof Function ? value(stored) : value;
    setStored(next);
    window.localStorage.setItem(key, JSON.stringify(next));
  };

  return [stored, setValue];
}