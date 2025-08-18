import type { ReactNode } from "react"
import { createContext } from "react"
import { Domain } from "../domain"

export interface InnerContext {
  domain: Domain
}

window.domain =
  window.domain ??
  Domain.create({
    CHAIN_ID: import.meta.env.VITE_CHAIN_ID,
    ZERODEV_PROJECT_ID: import.meta.env.VITE_ZERODEV_PROJECT_ID,
    ZERODEV_BUNDLER_RPC: import.meta.env.VITE_ZERODEV_BUNDLER_RPC,
    ZERODEV_PAYMASTER_RPC: import.meta.env.VITE_ZERODEV_PAYMASTER_RPC,
    ZERODEV_PASSKEY_URL: import.meta.env.VITE_ZERODEV_PASSKEY_URL,
    VITE_OPENSEA_URL: import.meta.env.VITE_OPENSEA_URL,
  })

const innerContext: InnerContext = {
  domain: window.domain,
}

const Context = createContext<InnerContext>(innerContext)

interface DomainProviderProps {
  children: ReactNode
}

export const DomainContext = ({ children }: DomainProviderProps) => {
  return <Context.Provider value={innerContext}>{children}</Context.Provider>
}
