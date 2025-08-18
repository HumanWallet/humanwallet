import { useState, useCallback } from "react"

export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  return [value, toggle] as const
}
