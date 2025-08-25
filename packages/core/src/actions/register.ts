import type { Config, KernelClient, SessionKeyAccount } from "@humanwallet/types"
import { WEB_AUTHENTICATION_MODE_KEY } from "@humanwallet/types"
import { createAccountAndClient } from "../lib/createAccountAndClient"
import { generateWebAuthenticationKey } from "../lib/generateWebAuthenticationKey"
import { setWebAuthenticationKey } from "../lib/setWebAuthenticationKey"

export const register = async (
  username: string,
  config: Config,
): Promise<{
  sessionKeyAccount: SessionKeyAccount
  kernelClient: KernelClient
}> => {
  const key = await generateWebAuthenticationKey(username, WEB_AUTHENTICATION_MODE_KEY.REGISTER, config)

  const [, { sessionKeyAccount, kernelClient }] = await Promise.all([
    setWebAuthenticationKey(key),
    createAccountAndClient(key, config),
  ])

  return {
    sessionKeyAccount,
    kernelClient,
  }
}
