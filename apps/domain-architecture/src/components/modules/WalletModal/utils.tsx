import {
  AddFilledIcon,
  AlertIcon,
  CheckOutlinedIcon,
  CloseCircleIcon,
  GiftIcon,
  Spinner,
  UnlockedIcon,
} from "@tutellus/tutellus-components"
import type { TransactionStatus, TransactionType } from "../../../domain/ethereum/Models/Transaction"
import { Transaction } from "../../../domain/ethereum/Models/Transaction"

const STATUS_ICONS: Record<TransactionStatus, React.JSX.Element> = {
  [Transaction.STATUS.PENDING]: <Spinner />,
  [Transaction.STATUS.SUCCESS]: <CheckOutlinedIcon />,
  [Transaction.STATUS.REVERTED]: <CloseCircleIcon />,
  [Transaction.STATUS.EXPIRED]: <AlertIcon />,
}

export const getStatusIcon = (status: TransactionStatus) => {
  return STATUS_ICONS[status]
}

const TRANSACTION_ICONS: Record<TransactionType, React.JSX.Element> = {
  [Transaction.TYPES.MINT]: <GiftIcon />,
  [Transaction.TYPES.APPROVE]: <UnlockedIcon />,
  [Transaction.TYPES.STAKE]: <AddFilledIcon />,
  [Transaction.TYPES.MINT_AND_STAKE]: <AddFilledIcon />,
}

export const getTypeIcon = (type: TransactionType) => {
  return TRANSACTION_ICONS[type]
}
