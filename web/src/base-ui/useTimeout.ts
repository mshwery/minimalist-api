import { useRef, useEffect } from 'react'

export function useTimeout(callback: () => void, delay: number | null = null): void {
  const fn = useRef(callback)

  // Remember the latest callback.
  useEffect(() => {
    fn.current = callback
  }, [callback])

  // Set up the timeout
  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => fn.current(), delay)
      return () => clearTimeout(id)
    }
  }, [delay])
}
