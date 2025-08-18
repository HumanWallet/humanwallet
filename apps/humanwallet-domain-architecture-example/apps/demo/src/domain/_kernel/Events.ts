import { Transaction, TransactionType } from "../ethereum/Models/Transaction"
import { DomainError } from "./DomainError"

export enum DomainEvents {
  SET_TRANSACTION = "SET_TRANSACTION",
  SUBMIT_SIGNATURE = "SUBMIG_SIGNATURE",
  SUBMIT_TRANSACTION = "SUBMIT_TRANSACTION",
  SUCCESS_SIGNATURE = "SUCCESS_SIGNATURE",
  SUCCESS_TRANSACTION = "SUCCESS_TRANSACTION",
  REVERTED_TRANSACTION = "REVERTED_TRANSACTION",
  ERROR = "ERROR",
}

export type DomainEventDetail = {
  [DomainEvents.SET_TRANSACTION]: { transaction: Transaction }
  [DomainEvents.SUBMIT_SIGNATURE]: null
  [DomainEvents.ERROR]: { domainError: DomainError }
  [DomainEvents.SUBMIT_TRANSACTION]: { transactionType: TransactionType }
  [DomainEvents.SUCCESS_SIGNATURE]: null
  [DomainEvents.SUCCESS_TRANSACTION]: { transaction: Transaction }
  [DomainEvents.REVERTED_TRANSACTION]: { transaction: Transaction }
}

export const dispatchDomainEvent = <T extends DomainEvents>(event: T, detail: DomainEventDetail[T]) => {
  window.dispatchEvent(new CustomEvent(event, { detail }))
}
