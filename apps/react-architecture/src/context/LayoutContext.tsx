import type { ReactNode } from "react"
import { createContext, useEffect, useContext, useCallback, useRef } from "react"
import type { ToasterHandle, ToastProps } from "@tutellus/tutellus-components"
import { Toaster } from "@tutellus/tutellus-components"
import { useLocalStorage } from "../hooks/useLocalStorage"

const THEME_MODE_STORAGE_KEY = "theme-mode"

export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

interface LayoutContextInterface {
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  addToast: (toast: Omit<ToastProps, "id" | "isExiting" | "onClose"> & { duration?: number }) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

const initialState: LayoutContextInterface = {
  themeMode: ThemeMode.LIGHT,
  setThemeMode: () => {},
  addToast: () => {},
  removeToast: () => {},
  clearAllToasts: () => {},
}

interface LayoutProviderProps {
  children: ReactNode
}

const Context = createContext<LayoutContextInterface>(initialState)

export const LayoutContext = ({ children }: LayoutProviderProps) => {
  const [themeMode, setThemeMode] = useLocalStorage<ThemeMode>(THEME_MODE_STORAGE_KEY, ThemeMode.DARK)
  const toasterRef = useRef<ToasterHandle>(null)

  const addToast = useCallback((toast: Omit<ToastProps, "id" | "isExiting" | "onClose"> & { duration?: number }) =>toasterRef.current?.addToast({ ...toast, onClose: () => {} }),[]) // prettier-ignore
  const removeToast = useCallback((id: string) => toasterRef.current?.removeToast(id), [])
  const clearAllToasts = useCallback(() => toasterRef.current?.clearAllToasts(), [])

  // Apply theme to root element
  useEffect(() => {
    console.log("themeMode", themeMode)
    const rootElement = document.getElementById("root")
    if (rootElement) {
      rootElement.classList.remove(ThemeMode.LIGHT, ThemeMode.DARK)
      rootElement.classList.add(themeMode)
    }
  }, [themeMode])

  return (
    <Context.Provider
      value={{
        themeMode,
        setThemeMode,
        addToast,
        removeToast,
        clearAllToasts,
      }}
    >
      <Toaster ref={toasterRef} />
      {children}
    </Context.Provider>
  )
}

export const useLayout = function () {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error(`useLayout must be used within a LayoutContextProvider`)
  }
  return context
}
