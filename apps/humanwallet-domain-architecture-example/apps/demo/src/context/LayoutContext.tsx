import { createContext, useEffect, ReactNode, useContext, useCallback, useRef } from "react"
import { DomainEventDetail, DomainEvents } from "../domain/_kernel/Events"
import { Toaster, ToasterHandle, ToastProps } from "@tutellus/tutellus-components"
import { useTranslation } from "react-i18next"
import { TransactionStatus } from "../domain/ethereum/Models/Transaction"
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
  const { t } = useTranslation("common")

  const addToast = useCallback((toast: Omit<ToastProps, "id" | "isExiting" | "onClose"> & { duration?: number }) =>toasterRef.current?.addToast({ ...toast, onClose: () => {} }),[]) // prettier-ignore
  const removeToast = useCallback((id: string) => toasterRef.current?.removeToast(id), [])
  const clearAllToasts = useCallback(() => toasterRef.current?.clearAllToasts(), [])

  const handleFinishedTransaction = useCallback(
    (e: CustomEvent<DomainEventDetail[DomainEvents.SUCCESS_TRANSACTION | DomainEvents.REVERTED_TRANSACTION]>) => {
      const { explorerUrl, type, status } = e.detail.transaction.serialize()

      addToast({
        message: t(`transactions.types.${type}`),
        onButtonClick: () => window.open(explorerUrl?.toString(), "_blank"),
        buttonText: t("view"),
        variant: status === TransactionStatus.SUCCESS ? "success" : "error",
        duration: 10000,
      })
    },
    [addToast],
  )

  // Apply theme to root element
  useEffect(() => {
    const rootElement = document.getElementById("root")
    if (rootElement) {
      rootElement.classList.remove(ThemeMode.LIGHT, ThemeMode.DARK)
      rootElement.classList.add(themeMode)
    }
  }, [themeMode])

  // Currency

  useEffect(() => {
    window.addEventListener(DomainEvents.SUCCESS_TRANSACTION, handleFinishedTransaction as EventListener)
    window.addEventListener(DomainEvents.REVERTED_TRANSACTION, handleFinishedTransaction as EventListener)

    return () => {
      window.removeEventListener(DomainEvents.SUCCESS_TRANSACTION, handleFinishedTransaction as EventListener)
      window.removeEventListener(DomainEvents.REVERTED_TRANSACTION, handleFinishedTransaction as EventListener)
    }
  }, [handleFinishedTransaction])

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
