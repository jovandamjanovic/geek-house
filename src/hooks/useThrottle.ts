'use client';

import { useRef, useCallback } from 'react';

export function useThrottle<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const lastCall = useRef<number>(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      callback(...args);
      lastCall.current = now;
    }
  }, [callback, delay]);
}
