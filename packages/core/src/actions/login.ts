import type { Config, KernelClient, SessionKeyAccount } from "types"
import { WEB_AUTHENTICATION_MODE_KEY } from "types"
import { generateWebAuthenticationKey, setWebAuthenticationKey } from "../lib/webAuthenticationKey"
import { createAccountAndClient } from "../lib/createAccountAndClient"

export const login = async (
  username: string,
  config: Config,
): Promise<{
  sessionKeyAccount: SessionKeyAccount
  kernelClient: KernelClient
}> => {
  const key = await generateWebAuthenticationKey(username, WEB_AUTHENTICATION_MODE_KEY.LOGIN, config)

  const [, { sessionKeyAccount, kernelClient }] = await Promise.all([
    setWebAuthenticationKey(key),
    createAccountAndClient(key, config),
  ])

  return {
    sessionKeyAccount,
    kernelClient,
  }
}
