import { get, set, del } from "idb-keyval"
import { GetTransactionsInput, LocalEthereumRepositoryInterface, SetTransactionInput } from "."
import { Transaction, TransactionSerialized } from "../Models/Transaction"
import { TransactionList } from "../Models/TransactionList"

const WEBAUTHN_STORAGE_KEY = "webAuthnKey"
const TX_STORAGE_KEY = "transactions"

export class IDBEthereumRepository implements LocalEthereumRepositoryInterface {
  static create() {
    if (typeof window === "undefined") throw new Error("IDBEthereumRepository can only be used in the browser")
    return new IDBEthereumRepository()
  }

  constructor() {}

  async setTransaction({ transaction }: SetTransactionInput) {
    const transactions = await this.getTransactions({ account: transaction.account })
    const existingTransaction = transactions.items.find(
      (tx) => (tx.hash && tx.hash === transaction.hash) || (tx.userOpHash && tx.userOpHash === transaction.userOpHash),
    )

    if (existingTransaction) {
      Object.assign(existingTransaction, transaction)
    } else {
      transactions.items.push(transaction)
    }

    const serializedTransactions = transactions.items.map((tx) => tx.serialize())

    await set(TX_STORAGE_KEY, serializedTransactions)
    return transaction
  }

  async getTransactions({ account }: GetTransactionsInput): Promise<TransactionList> {
    const transactions = await get(TX_STORAGE_KEY)
    if (!transactions) return TransactionList.empty()

    const userTransactions = transactions
      .map((tx: TransactionSerialized) => {
        return Transaction.create({
          ...tx,
        })
      })
      .filter((tx: Transaction) => tx.account === account)

    return TransactionList.create({ items: userTransactions })
  }

  async cleanTransactions({ account }: GetTransactionsInput) {
    const transactions = await get(TX_STORAGE_KEY)
    if (!transactions) return
    const userTransactions = transactions.filter((tx: TransactionSerialized) => tx.account !== account)
    await set(TX_STORAGE_KEY, userTransactions)
  }

  async getWebAuthnKey() {
    const webAuthnKey = await get(WEBAUTHN_STORAGE_KEY)

    return webAuthnKey || undefined
  }

  async setWebAuthnKey(webAuthnKey: object) {
    await set(WEBAUTHN_STORAGE_KEY, webAuthnKey)

    return webAuthnKey
  }

  async delWebAuthnKey() {
    await del(WEBAUTHN_STORAGE_KEY)
  }
}
