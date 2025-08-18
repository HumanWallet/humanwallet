import { createContext, ReactNode, useState, useEffect, useContext } from "react"
import { watchAccount } from "@wagmi/core"
import { ConnectEthereumUseCaseInput } from "../domain/ethereum/UseCases/ConnectEthereumUseCase"
import { WalletState } from "../domain/ethereum/Models/WalletState"
import { publicClient } from "../js/viem"
import { wagmiConfig } from "../js/wagmi"
import { useDocumentVisibility } from "../hooks/useDocumentVisibility"

window.publicClient = window.publicClient ?? publicClient
window.wagmiConfig = window.wagmiConfig ?? wagmiConfig

interface EthereumContextInterface {
  wallet: WalletState
  isWalletConnected: boolean
  connectWallet: ({ connector }: ConnectEthereumUseCaseInput) => Promise<void>
  disconnectWallet: () => Promise<void>
  switchChain: () => Promise<void>
  register: ({ username }: { username: string }) => Promise<void>
  login: ({ username }: { username: string }) => Promise<void>
  waitForNextBlockNumber: () => Promise<number>
}

const initialState: EthereumContextInterface = {
  wallet: WalletState.empty(),
  isWalletConnected: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  switchChain: async () => {},
  register: async () => {},
  login: async () => {},
  waitForNextBlockNumber: async () => 0,
}

interface EthereumProviderProps {
  children: ReactNode
}

const Context = createContext<EthereumContextInterface>(initialState)

export const EthereumContext = ({ children }: EthereumProviderProps) => {
  const [wallet, setWallet] = useState<WalletState>(initialState.wallet)
  const isVisible = useDocumentVisibility()

  const setLoadingState = () => {
    if (wallet.status === WalletState.STATUS.CONNECTING) return
    setWallet(WalletState.create({ status: WalletState.STATUS.CONNECTING }))
  }

  const setEmptyState = () => setWallet(WalletState.empty())

  const updateWalletState = async () => {
    window.domain.GetWalletStateEthereumUseCase.execute()
      .then((updatedWallet) => {
        if (wallet.account && wallet.account !== updatedWallet.account) window.location.reload()
        if (wallet.serialize() === updatedWallet.serialize()) return

        setWallet(updatedWallet)
      })
      .catch(setEmptyState)
  }

  const connectWallet = async ({ connector }: ConnectEthereumUseCaseInput) => {
    setLoadingState()

    window.domain.ConnectEthereumUseCase.execute({ connector }).then(setWallet).catch(setEmptyState)
  }

  const disconnectWallet = async () => {
    window.domain.DisconnectEthereumUseCase.execute().then(setWallet).catch(setEmptyState)
  }

  const switchChain = async () => {
    window.domain.SwitchChainEthereumUseCase.execute().then(setWallet).catch(setEmptyState)
  }

  const register = async ({ username }: { username: string }) => {
    setLoadingState()
    window.domain.RegisterEthereumUseCase.execute({ username }).then(setWallet).catch(setEmptyState)
  }

  const login = async ({ username }: { username: string }) => {
    setLoadingState()
    window.domain.LoginEthereumUseCase.execute({ username }).then(setWallet).catch(setEmptyState)
  }

  const waitForNextBlockNumber = async (): Promise<number> => {
    return new Promise((resolve, reject) => {
      let currentBlockNumber: number | undefined

      try {
        // Start watching for block numbers
        const unwatch = window.publicClient.watchBlockNumber({
          onBlockNumber: (blockNumber) => {
            if (currentBlockNumber === undefined) {
              // Capture the initial block number
              currentBlockNumber = Number(blockNumber)
            } else if (blockNumber > currentBlockNumber) {
              // Resolve only when the block number increments
              unwatch()
              resolve(Number(blockNumber))
            }
          },
          onError: (error) => {
            unwatch()
            reject(error)
          },
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  // Initial silent connect
  useEffect(() => {
    setLoadingState()
    window.domain.ReconnectEthereumUseCase.execute().then(updateWalletState).catch(setEmptyState)
  }, [])

  // Browser wallet events
  useEffect(() => {
    if (wallet.type !== WalletState.TYPES.INJECTED) return

    return watchAccount(window.wagmiConfig, {
      onChange() {
        if (wallet.status !== WalletState.STATUS.CONNECTING) updateWalletState()
      },
    })
  }, [wallet])

  // RPC events
  useEffect(() => {
    const unwatch = window.publicClient.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        console.log("__________", Number(blockNumber), "__________")
        window.blockNumber = Number(blockNumber)
      },
    })

    if (!isVisible) unwatch()

    return unwatch
  }, [isVisible])

  return (
    <Context.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        switchChain,
        register,
        login,
        waitForNextBlockNumber,
        isWalletConnected: wallet.status === WalletState.STATUS.CONNECTED,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useEthereum = function () {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error(`useEthereum must be used within a EthereumContextProvider`)
  }
  return context
}
