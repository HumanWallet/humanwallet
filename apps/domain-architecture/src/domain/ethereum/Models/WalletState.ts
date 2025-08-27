import { z } from "zod"
import type { Address } from "viem"
import { isAddress } from "viem"
import { WalletConnector } from "./WalletConnector"
import { getExplorerAddressURL } from "../../../js/chain"

enum WalletType {
  INJECTED = "INJECTED",
  ABSTRACTED = "ABSTRACTED",
}

enum WalletStatus {
  CONNECTED = "CONNECTED",
  CONNECTING = "CONNECTING",
  DISCONNECTED = "DISCONNECTED",
  WRONG_CHAIN = "WRONG_CHAIN",
}

const WalletStateValidations = z.object({
  account: z.string().refine(isAddress).optional(),
  status: z.nativeEnum(WalletStatus),
  type: z.nativeEnum(WalletType).optional(),
  connector: z.instanceof(WalletConnector).optional(),
})

export class WalletState {
  constructor(
    private readonly _account: Address | undefined,
    private readonly _status: WalletStatus,
    private readonly _type: WalletType | undefined,
    private readonly _connector: WalletConnector | undefined,
  ) {}

  static create({
    account,
    status = WalletStatus.DISCONNECTED,
    type,
    connector,
  }: z.infer<typeof WalletStateValidations>) {
    const { error, data } = WalletStateValidations.safeParse({ account, status, type, connector })
    if (error) throw new Error(error.message)
    return new WalletState(data.account, data.status, data.type, data.connector)
  }

  static STATUS = WalletStatus
  static TYPES = WalletType

  static empty() {
    return new WalletState(undefined, WalletStatus.DISCONNECTED, undefined, undefined)
  }

  get account() { return this._account } // prettier-ignore
  get status() { return this._status } // prettier-ignore
  get type() { return this._type } // prettier-ignore
  get connector() { return this._connector } // prettier-ignore
  get explorerUrl() {
    if (!this.account) return ""
    const explorerUrl = getExplorerAddressURL(this.account)
    return explorerUrl
  }

  get isInjected() { return this.type === WalletType.INJECTED } // prettier-ignore

  serialize() {
    return {
      account: this.account,
      status: this.status,
      type: this.type,
      connector: this.connector,
      explorerUrl: this.explorerUrl,
    }
  }
}
