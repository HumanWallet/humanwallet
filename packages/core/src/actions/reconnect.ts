import type { Config, KernelClient, SessionKeyAccount } from "@humanwallet/types"
import { createAccountAndClient } from "../lib/createAccountAndClient"
import { getWebAuthenticationKey } from "../lib/getWebAuthenticationKey"
import { setWebAuthenticationKey } from "../lib/setWebAuthenticationKey"

export const reconnect = async (
  config: Config,
): Promise<{
  sessionKeyAccount: SessionKeyAccount | null
  kernelClient: KernelClient | null
}> => {
  const key = await getWebAuthenticationKey()

  if (!key) {
    return {
      sessionKeyAccount: null,
      kernelClient: null,
    }
  }

  const [, { sessionKeyAccount, kernelClient }] = await Promise.all([
    setWebAuthenticationKey(key),
    createAccountAndClient(key, config),
  ])

  return {
    sessionKeyAccount,
    kernelClient,
  }
}
