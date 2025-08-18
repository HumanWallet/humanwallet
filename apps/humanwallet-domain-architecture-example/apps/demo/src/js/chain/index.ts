import { Address } from "viem"

export const CHAIN_ID = import.meta.env.VITE_CHAIN_ID

const getExplorerURL = () => {
  const client = window.publicClient
  return client.chain?.blockExplorers?.default.url
}

export const getExplorerAddressURL = (address: Address) => {
  const explorerUrl = getExplorerURL()
  return `${explorerUrl}/address/${address}`
}

export const getExplorerTokenURL = (address: Address) => {
  const explorerUrl = getExplorerURL()
  return `${explorerUrl}/token/${address}`
}

export const getExplorerTransactionURL = (hash: string) => {
  const explorerUrl = getExplorerURL()
  return `${explorerUrl}/tx/${hash}`
}
