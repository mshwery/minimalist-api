import { useRef, useEffect, MutableRefObject } from 'react'
import { createFocusTrap, Options, FocusTrap } from 'focus-trap'

interface FocusTrapReturn {
  ref: MutableRefObject<HTMLElement>
}

export function useFocusTrap(isShown: boolean, options: Options = {}): FocusTrapReturn {
  const elementRef = useRef() as MutableRefObject<HTMLElement>
  const trapRef = useRef() as MutableRefObject<FocusTrap>

  function focusElement() {
    if (!elementRef.current) {
      return
    }

    const trap = createFocusTrap(elementRef.current, {
      escapeDeactivates: true,
      clickOutsideDeactivates: false,
      fallbackFocus: '[tabindex="-1"]',
      ...options,
    })

    trapRef.current = trap
    trap.activate()
  }

  function focusTrigger() {
    if (!trapRef.current) {
      return
    }

    trapRef.current.deactivate()
  }

  useEffect(() => {
    if (isShown) {
      focusElement()
    } else {
      focusTrigger()
    }
  }, [isShown]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ref: elementRef,
  }
}
