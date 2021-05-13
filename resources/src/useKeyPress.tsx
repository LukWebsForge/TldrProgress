import { useCallback, useEffect } from 'react'

// Inspired by https://usehooks.com/useKeyPress/

function useKeyPress(targetKey: string, onPressed?: () => void) {
  // Only triggered if the callback is defined and the target key is pressed
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (onPressed && event.key === targetKey) {
        onPressed()
      }
    },
    [targetKey, onPressed]
  )

  useEffect(() => {
    if (onPressed) {
      // Register event listener
      window.addEventListener('keydown', onKeyDown)
      // Remove event listener on cleanup
      return () => {
        window.removeEventListener('keydown', onKeyDown)
      }
    }
  }, [onPressed, onKeyDown])
}

export { useKeyPress }
