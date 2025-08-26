import { type Connector } from "@wagmi/core"
import { z } from "zod"

const WalletConnectorValidations = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
})

export class WalletConnector {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _icon: string | undefined,
  ) {}

  static create({ id, name, icon }: z.infer<typeof WalletConnectorValidations>) {
    const { success } = WalletConnectorValidations.safeParse({ id, name, icon })
    if (!success) throw new Error("Invalid wallet connector")

    return new WalletConnector(id, name, icon)
  }

  static createFromConnector({ connector }: { connector: Connector }) {
    return new WalletConnector(connector.id, connector.name, connector.icon)
  }

  get id() { return this._id } // prettier-ignore
  get name() { return this._name } // prettier-ignore
  get icon() { return this._icon } // prettier-ignore

  serialize() {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
    }
  }
}
