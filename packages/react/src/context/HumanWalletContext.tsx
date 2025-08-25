import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Config } from "@humanwallet/types"
import type { AuthState, HumanWalletContextValue, HumanWalletProviderProps } from "../types"

/**
 * Context for HumanWallet state management
 */
const HumanWalletContext = createContext<HumanWalletContextValue | null>(null)

/**
 * Hook to access HumanWallet context
 * @throws Error if used outside of HumanWalletProvider
 */
export const useHumanWalletContext = (): HumanWalletContextValue => {
  const context = useContext(HumanWalletContext)

  if (!context) {
    throw new Error("useHumanWalletContext must be used within a HumanWalletProvider")
  }

  return context
}

/**
 * Provider component for HumanWallet context
 */
export const HumanWalletProvider = ({ config: initialConfig, children }: HumanWalletProviderProps) => {
  const [config, setConfig] = useState<Config>(initialConfig)
  const [authState, setAuthState] = useState<AuthState>({ status: "idle" })

  const updateConfig = useCallback((newConfig: Partial<Config>) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      ...newConfig,
    }))
  }, [])

  const contextValue: HumanWalletContextValue = {
    config,
    authState,
    setAuthState,
    updateConfig,
  }

  return <HumanWalletContext.Provider value={contextValue}>{children}</HumanWalletContext.Provider>
}
