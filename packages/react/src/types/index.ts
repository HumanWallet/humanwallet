import type { Config, KernelClient, SessionKeyAccount } from "@humanwallet/types"

/**
 * State of the authentication process
 */
export type AuthState =
  | { status: "idle" }
  | { status: "connecting" }
  | { status: "connected"; account: SessionKeyAccount; client: KernelClient }
  | { status: "error"; error: Error }

/**
 * Hook return type for authentication operations
 */
export interface UseAuthReturn {
  readonly state: AuthState
  readonly isIdle: boolean
  readonly isConnecting: boolean
  readonly isConnected: boolean
  readonly isError: boolean
  readonly account: SessionKeyAccount | undefined
  readonly client: KernelClient | undefined
  readonly error: Error | undefined
  readonly login: (username: string) => Promise<void>
  readonly register: (username: string) => Promise<void>
  readonly disconnect: () => Promise<void>
  readonly reconnect: () => Promise<void>
}

/**
 * Hook return type for account operations
 */
export interface UseAccountReturn {
  readonly account: SessionKeyAccount | undefined
  readonly address: string | undefined
  readonly isConnected: boolean
}

/**
 * Hook return type for configuration
 */
export interface UseConfigReturn {
  readonly config: Config
  readonly updateConfig: (newConfig: Partial<Config>) => void
}

/**
 * Context value for the HumanWallet provider
 */
export interface HumanWalletContextValue {
  readonly config: Config
  readonly authState: AuthState
  readonly setAuthState: (state: AuthState) => void
  readonly updateConfig: (newConfig: Partial<Config>) => void
}

/**
 * Provider props
 */
export interface HumanWalletProviderProps {
  readonly config: Config
  readonly children: React.ReactNode
}

/**
 * Contract operation state
 */
export type ContractState<TData = unknown> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: TData }
  | { status: "error"; error: Error }

/**
 * Hook return type for contract read operations
 */
export interface UseReadContractReturn<TData = unknown> {
  readonly state: ContractState<TData>
  readonly data: TData | undefined
  readonly error: Error | undefined
  readonly isLoading: boolean
  readonly isSuccess: boolean
  readonly isError: boolean
  readonly refetch: () => Promise<void>
}

/**
 * Hook return type for contract write operations
 */
export interface UseWriteContractReturn {
  readonly state: ContractState<string>
  readonly data: string | undefined
  readonly error: Error | undefined
  readonly isLoading: boolean
  readonly isSuccess: boolean
  readonly isError: boolean
  readonly write: () => Promise<void>
  readonly reset: () => void
}
