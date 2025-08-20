import { Transaction, TransactionType } from "./Transaction"

export type TransactionListSerialized = ReturnType<TransactionList["serialize"]>

export class TransactionList {
  constructor(private readonly _items: Transaction[]) {}

  static create({ items }: { items: Transaction[] }) {
    return new TransactionList(items)
  }

  static empty() {
    return new TransactionList([])
  }

  isPendingByType(type: TransactionType) {
    return this.pending.some((tx) => tx.type === type)
  }

  isSuccesByHash(hash: string) {
    return this._items.some((tx) => tx.hash === hash && tx.status === Transaction.STATUS.SUCCESS)
  }

  get items() { return this._items } // prettier-ignore
  get pending() { return this._items.filter(({ status }) => status === Transaction.STATUS.PENDING) } // prettier-ignore
  get isEmpty() { return this._items.length === 0 } // prettier-ignore

  get isPendingMint() { return this.isPendingByType(TransactionType.MINT) } // prettier-ignore
  get isPendingApprove() { return this.isPendingByType(TransactionType.APPROVE) } // prettier-ignore
  get isPendingStake() { return this.isPendingByType(TransactionType.STAKE) } // prettier-ignore
  get isPendingMintAndStake() { return this.isPendingByType(TransactionType.MINT_AND_STAKE) } // prettier-ignore

  serialize() {
    return {
      items: this._items.map((transaction) => transaction.serialize()),
      pending: this.pending.map((transaction) => transaction.serialize()),
    }
  }
}
