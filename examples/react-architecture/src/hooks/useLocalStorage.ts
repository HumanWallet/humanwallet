import { useState, useEffect } from "react"

type SetValue<T> = T | ((prevValue: T) => T)
type ReturnType<T> = [T, (value: SetValue<T>) => void, () => void]

export function useLocalStorage<T>(key: string, initialValue?: T): ReturnType<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: SetValue<T>): void => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)

      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  const removeItem = (): void => {
    try {
      localStorage.removeItem(key)
      setStoredValue(initialValue as T)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn(`Error parsing localStorage value:`, error)
        }
      }
    }

    addEventListener("storage", handleStorageChange)
    return () => removeEventListener("storage", handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeItem]
}
