import { toPasskeyValidator, PasskeyValidatorContractVersion } from "@zerodev/passkey-validator"
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
  getUserOperationGasPrice,
} from "@zerodev/sdk"
import { getEntryPoint, KERNEL_V3_1 } from "@zerodev/sdk/constants"
import type { Config, KernelClient, PublicClient, SessionKeyAccount, WebAuthenticationKey } from "types"

const ENTRY_POINT_VERSION = "0.7"

const getPasskeyValidator = async (webAuthnKey: WebAuthenticationKey, publicClient: PublicClient) => {
  return await toPasskeyValidator(publicClient, {
    webAuthnKey,
    entryPoint: getEntryPoint(ENTRY_POINT_VERSION),
    kernelVersion: KERNEL_V3_1,
    validatorContractVersion: PasskeyValidatorContractVersion.V0_0_2,
  })
}

const createPaymasterClient = async (config: Pick<Config, "chain" | "paymasterTransport">) => {
  return await createZeroDevPaymasterClient({
    chain: config.chain,
    transport: config.paymasterTransport,
  })
}

export const createAccountAndClient = async (
  webAuthnKey: WebAuthenticationKey,
  config: Config,
): Promise<{ sessionKeyAccount: SessionKeyAccount; kernelClient: KernelClient }> => {
  const validator = await getPasskeyValidator(webAuthnKey, config.publicClient)
  const sessionKeyAccount = await createKernelAccount(config.publicClient, {
    entryPoint: getEntryPoint(ENTRY_POINT_VERSION),
    plugins: { sudo: validator },
    kernelVersion: KERNEL_V3_1,
  })

  const paymasterClient = await createPaymasterClient(config)

  const kernelClient = createKernelAccountClient({
    account: sessionKeyAccount,
    chain: config.chain,
    client: config.publicClient,
    bundlerTransport: config.bundlerTransport,
    paymaster: {
      getPaymasterData: (userOperation) => paymasterClient.sponsorUserOperation({ userOperation }),
    },
    userOperation: {
      estimateFeesPerGas: ({ bundlerClient }) => getUserOperationGasPrice(bundlerClient),
    },
  })

  return {
    sessionKeyAccount,
    kernelClient,
  }
}
