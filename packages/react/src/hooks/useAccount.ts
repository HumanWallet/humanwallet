import type { Config } from "@humanwallet/types"

export { register, login, disconnect, hasAccount, reconnect } from "@humanwallet/core"

export const useAccount = (config: Config) => {
  const register = useCallback
}
