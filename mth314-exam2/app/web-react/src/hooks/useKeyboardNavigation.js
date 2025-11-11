import { useEffect } from 'react'

/**
 * Custom hook for keyboard navigation in quiz
 */
export const useKeyboardNavigation = ({
  onPrev,
  onNext,
  onSubmit,
  onSelectChoice,
  canGoBack,
  canGoForward,
  showSubmit,
  totalChoices,
  disabled = false,
}) => {
  useEffect(() => {
    if (disabled) return

    const handleKeyDown = event => {
      // Don't handle keyboard shortcuts when user is typing in an input/textarea
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (canGoBack) {
            event.preventDefault()
            onPrev?.()
          }
          break

        case 'ArrowRight':
          if (canGoForward) {
            event.preventDefault()
            onNext?.()
          } else if (showSubmit) {
            event.preventDefault()
            onSubmit?.()
          }
          break

        case 'Enter':
          if (showSubmit) {
            event.preventDefault()
            onSubmit?.()
          }
          break

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          // Number keys 1-9 map to choices 0-8
          const choiceIndex = parseInt(event.key, 10) - 1
          if (choiceIndex >= 0 && choiceIndex < totalChoices) {
            event.preventDefault()
            onSelectChoice?.(choiceIndex)
          }
          break
        }

        case 'a':
        case 'A':
        case 'b':
        case 'B':
        case 'c':
        case 'C':
        case 'd':
        case 'D':
        case 'e':
        case 'E':
        case 'f':
        case 'F':
        case 'g':
        case 'G':
        case 'h':
        case 'H':
        case 'i':
        case 'I': {
          // Letter keys A-I map to choices 0-8
          const letterIndex = event.key.toUpperCase().charCodeAt(0) - 65
          if (letterIndex >= 0 && letterIndex < totalChoices) {
            event.preventDefault()
            onSelectChoice?.(letterIndex)
          }
          break
        }

        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    disabled,
    onPrev,
    onNext,
    onSubmit,
    onSelectChoice,
    canGoBack,
    canGoForward,
    showSubmit,
    totalChoices,
  ])
}

