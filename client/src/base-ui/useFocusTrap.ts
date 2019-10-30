import { useRef, useEffect } from 'react'
import createFocusTrap, { Options } from 'focus-trap'

export function useFocusTrap(isShown: boolean, options: Options = {}) {
  const elementRef = useRef<HTMLElement>(null)
  const trapRef = useRef<HTMLElement>(null)

  function focusElement() {
    if (!elementRef.current) {
      return
    }

    const trap = createFocusTrap(elementRef.current, {
      escapeDeactivates: true,
      clickOutsideDeactivates: false,
      fallbackFocus: '[tabindex="-1"]',
      ...options
    })

    // @ts-ignore
    trapRef.current = trap
    trap.activate()
  }

  function focusTrigger() {
    if (!trapRef.current) {
      return
    }

    // @ts-ignore
    trapRef.current.deactivate()
  }

  useEffect(() => {
    if (isShown) {
      focusElement()
    } else {
      focusTrigger()
    }
  }, [isShown])

  return {
    ref: elementRef
  }
}
