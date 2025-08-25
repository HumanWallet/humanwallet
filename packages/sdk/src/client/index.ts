import {
  disconnect as disconnectAction,
  createConfig,
  login as loginAction,
  register as registerAction,
  reconnect as reconnectAction,
  writeContract as writeContractAction,
  writeContracts as writeContractsAction,
  readContract as readContractAction,
  waitForTransaction as waitForTransactionAction,
  waitForUserOperation as waitForUserOperationAction,
  signTypedData as signTypedDataAction,
  hasAccount as hasAccountAction,
} from "@humanwallet/core"
import type {
  Config,
  UserOperationHash,
  Chain,
  Address,
  Hash,
  ReadContractParameters,
  SignTypedDataParameters,
  WriteContractParameters,
} from "@humanwallet/types"

export class ClientRepository {
  private config: Config

  constructor(bundlerRpc: string, paymasterRpc: string, passkeyUrl: string, chain: Chain) {
    this.config = createConfig({
      bundlerRpc,
      paymasterRpc,
      passkeyUrl,
      chain,
    })
  }

  public get address() {
    return this.config.sessionKeyAccount?.address
  }

  public async register(username: string): Promise<Address> {
    const { sessionKeyAccount, kernelClient } = await registerAction(username, this.config)

    this.config.sessionKeyAccount = sessionKeyAccount
    this.config.kernelClient = kernelClient

    if (!this.address) {
      throw new Error("Account not created")
    }

    return this.address
  }

  public async login(username: string): Promise<Address> {
    const { sessionKeyAccount, kernelClient } = await loginAction(username, this.config)

    this.config.sessionKeyAccount = sessionKeyAccount
    this.config.kernelClient = kernelClient

    if (!this.address) {
      throw new Error("Account not created")
    }

    return this.address
  }

  public async disconnect(): Promise<void> {
    await disconnectAction()
  }

  public async hasAccount(): Promise<boolean> {
    return await hasAccountAction()
  }

  public async reconnect(): Promise<Address | null> {
    const { sessionKeyAccount, kernelClient } = await reconnectAction(this.config)

    if (!sessionKeyAccount || !kernelClient) return null

    this.config.sessionKeyAccount = sessionKeyAccount
    this.config.kernelClient = kernelClient

    if (!this.address) return null

    return this.address
  }

  public async readContract(args: ReadContractParameters) {
    return await readContractAction(this.config, args)
  }

  public async writeContract(args: WriteContractParameters) {
    return await writeContractAction(this.config, args)
  }

  public async writeContracts(contracts: WriteContractParameters[]) {
    return await writeContractsAction(this.config, contracts)
  }

  public async waitForUserOperation(userOperationHash: UserOperationHash) {
    return await waitForUserOperationAction(this.config, userOperationHash)
  }

  public async signTypedData(args: SignTypedDataParameters) {
    return await signTypedDataAction(this.config, args)
  }

  public async waitForTransaction(transactionHash: Hash) {
    return await waitForTransactionAction(this.config, transactionHash)
  }
}
