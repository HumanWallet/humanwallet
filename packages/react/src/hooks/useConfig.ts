import { useHumanWalletContext } from "../context/HumanWalletContext"
import type { UseConfigReturn } from "../types"

/**
 * Hook to access and update HumanWallet configuration
 *
 * @returns Object containing current config and update function
 *
 * @example
 * ```tsx
 * const { config, updateConfig } = useConfig()
 *
 * // Update configuration
 * updateConfig({
 *   passkeyUrl: 'https://new-url.com'
 * })
 * ```
 */
export const useConfig = (): UseConfigReturn => {
  const { config, updateConfig } = useHumanWalletContext()

  return {
    config,
    updateConfig,
  }
}
