import { createContext, ReactNode, useState, useEffect, useContext } from "react"
import { WalletState } from "../domain/ethereum/Models/WalletState"
import { DomainEventDetail, DomainEvents } from "../domain/_kernel/Events"
import { TransactionList } from "../domain/ethereum/Models/TransactionList"
import { TransactionType } from "../domain/ethereum/Models/Transaction"
import { useEthereum } from "./EthereumContext"
import { ErrorCodes } from "../domain/_kernel/ErrorCodes"

interface TransactionsContextInterface {
  transactions: TransactionList
  submittedTransactionType: TransactionType | null
  isSubmitting: boolean
  cleanTransactions: () => void
}

const initialState: TransactionsContextInterface = {
  transactions: TransactionList.empty(),
  submittedTransactionType: null,
  isSubmitting: false,
  cleanTransactions: () => {},
}

const Context = createContext<TransactionsContextInterface>(initialState)

interface TransactionProviderProps {
  children: ReactNode
}

export const TransactionsContext = ({ children }: TransactionProviderProps) => {
  const { wallet } = useEthereum()
  const [transactions, setTransactions] = useState<TransactionList>(initialState.transactions)
  const [submittedTransactionType, setSubmittedTransactionType] = useState<TransactionType | null>(null)
  const [isSignatureSubmitting, setIsSignatureSubmitting] = useState(false)

  const handleSubmitTransaction = (e: CustomEvent<DomainEventDetail[DomainEvents.SUBMIT_TRANSACTION]>) =>
    setSubmittedTransactionType(e.detail.transactionType)

  const handleSubmitSignature = () => setIsSignatureSubmitting(true)
  const handleSubmitSignatureSuccess = () => setIsSignatureSubmitting(false)

  const handleDomainError = (e: CustomEvent<DomainEventDetail[DomainEvents.ERROR]>) => {
    switch (e.detail.domainError.code) {
      case ErrorCodes.SIGNATURE_ERROR:
      case ErrorCodes.USER_REJECTED_SIGNATURE:
        setIsSignatureSubmitting(false)
        break
      case ErrorCodes.TRANSACTION_ERROR:
      case ErrorCodes.USER_REJECTED_TRANSACTION:
        setSubmittedTransactionType(null)
        break
    }
  }

  const handleSetTransaction = () => {
    updateTransactions()
    setSubmittedTransactionType(null)
  }

  const updateTransactions = () => {
    window.domain.GetTransactionsEthereumUseCase.execute()
      .then(setTransactions)
      .catch(() => setTransactions(TransactionList.empty()))
  }

  const cleanTransactions = () => {
    window.domain.CleanTransactionsEthereumUseCase.execute().then(() => setTransactions(TransactionList.empty()))
  }

  // Transactions initial load
  useEffect(() => {
    if (wallet.status !== WalletState.STATUS.CONNECTED) return
    updateTransactions()
  }, [wallet])

  // Wait pending transactions
  useEffect(() => {
    transactions.pending.forEach((transaction) => {
      window.domain.WaitForTransactionEthereumUseCase.execute({ transaction }).then(updateTransactions)
    })
  }, [transactions])

  // Event listeners
  useEffect(() => {
    window.addEventListener(DomainEvents.SET_TRANSACTION, handleSetTransaction)
    window.addEventListener(DomainEvents.SUBMIT_SIGNATURE, handleSubmitSignature)
    window.addEventListener(DomainEvents.ERROR, handleDomainError as EventListener)
    window.addEventListener(DomainEvents.SUBMIT_TRANSACTION, handleSubmitTransaction as EventListener)
    window.addEventListener(DomainEvents.SUCCESS_SIGNATURE, handleSubmitSignatureSuccess)

    return () => {
      window.removeEventListener(DomainEvents.SET_TRANSACTION, handleSetTransaction)
      window.removeEventListener(DomainEvents.SUBMIT_SIGNATURE, handleSubmitSignature)
      window.removeEventListener(DomainEvents.ERROR, handleDomainError as EventListener)
      window.removeEventListener(DomainEvents.SUBMIT_TRANSACTION, handleSubmitTransaction as EventListener)
      window.removeEventListener(DomainEvents.SUCCESS_SIGNATURE, handleSubmitSignatureSuccess)
    }
  }, [])

  return (
    <Context.Provider
      value={{
        transactions,
        submittedTransactionType,
        isSubmitting: Boolean(submittedTransactionType) || isSignatureSubmitting,
        cleanTransactions,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useTransactions = function () {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error(`useTransactions must be used within a TransactionsContextProvider`)
  }
  return context
}
