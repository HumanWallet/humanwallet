import { useMemo } from "react"

interface UseTruncateAddressOptions {
  startLength?: number
  endLength?: number
  separator?: string
}

/**
 * Custom hook to truncate wallet addresses
 * @param address - The full wallet address to truncate
 * @param options - Configuration options for truncation
 * @returns The truncated address string
 */
export function useTruncateAddress(address: string, options: UseTruncateAddressOptions = {}): string {
  const { startLength = 8, endLength = 6, separator = "..." } = options

  return useMemo(() => {
    if (!address) return ""

    // If address is shorter than the combined length, return as is
    if (address.length <= startLength + endLength + separator.length) {
      return address
    }

    const start = address.slice(0, startLength)
    const end = address.slice(-endLength)

    return `${start}${separator}${end}`
  }, [address, startLength, endLength, separator])
}
