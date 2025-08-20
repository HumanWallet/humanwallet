import type { Address, Hash } from "viem"
import { isAddress, isHash } from "viem"
import { z } from "zod"

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  REVERTED = "REVERTED",
  EXPIRED = "EXPIRED",
}

export enum TransactionType {
  MINT = "MINT",
  APPROVE = "APPROVE",
  STAKE = "STAKE",
  MINT_AND_STAKE = "MINT_AND_STAKE",
}

const TransactionValidations = z.object({
  hash: z.string().refine(isHash).optional(),
  account: z.string().refine(isAddress),
  type: z.nativeEnum(TransactionType),
  status: z.nativeEnum(TransactionStatus).optional(),
  userOpHash: z.string().refine(isHash).optional(),
  date: z.date().optional(),
  contract: z.string().refine(isAddress).optional(),
  functionName: z.string().optional(),
  args: z.array(z.any()).optional(),
})

export type TransactionSerialized = z.infer<typeof TransactionValidations>

export class Transaction {
  constructor(
    private readonly _account: Address,
    private readonly _status: TransactionStatus,
    private readonly _type: TransactionType,
    private readonly _hash?: Hash,
    private readonly _userOpHash?: Hash,
    private readonly _date?: Date,
    private readonly _contract?: Address,
    private readonly _functionName?: string,
    private readonly _args?: unknown[],
  ) {}

  static create({
    account,
    status = TransactionStatus.PENDING,
    type,
    hash,
    userOpHash,
    date = new Date(),
    contract,
    functionName,
    args,
  }: z.infer<typeof TransactionValidations>) {
    if (!hash && !userOpHash) throw new Error("hash or userOpHash is required")

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const parsedStatus = status === TransactionStatus.PENDING && date < oneHourAgo ? TransactionStatus.EXPIRED : status

    const { error, success } = TransactionValidations.safeParse({
      account,
      status: parsedStatus,
      type,
      hash,
      userOpHash,
      date,
      contract,
      functionName,
      args,
    })

    if (!success) throw new Error(error?.message)

    return new Transaction(account, parsedStatus, type, hash, userOpHash, date, contract, functionName, args)
  }

  static STATUS = TransactionStatus
  static TYPES = TransactionType

  get account() { return this._account } // prettier-ignore
  get status () { return this._status } // prettier-ignore
  get type () { return this._type } // prettier-ignore
  get hash() { return this._hash } // prettier-ignore
  get userOpHash() { return this._userOpHash } // prettier-ignore
  get date () { return this._date } // prettier-ignore
  get contract() { return this._contract } // prettier-ignore
  get functionName() { return this._functionName } // prettier-ignore
  get args () { return this._args } // prettier-ignore

  get explorerUrl() {
    const client = window.publicClient
    if (!this.hash) return `https://jiffyscan.xyz/userOpHash/${this.userOpHash}?network=${client.chain?.id}`
    const explorerUrl = client.chain?.blockExplorers?.default.url
    if (!explorerUrl) return undefined
    return `${explorerUrl}/tx/${this.hash}`
  }

  serialize() {
    return {
      account: this.account,
      status: this.status,
      type: this.type,
      hash: this.hash,
      userOpHash: this.userOpHash,
      date: this.date,
      contract: this.contract,
      functionName: this.functionName,
      args: this.args,
      explorerUrl: this.explorerUrl,
    }
  }
}
