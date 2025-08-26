import cx from "classnames"
import { useTranslation } from "react-i18next"
import { Modal, AddressBox, Button } from "@tutellus/tutellus-components"
import { Link } from "react-router"
import { useEthereum, useTransactions } from "../../../context"
import { Transaction } from "../../../domain/ethereum/Models/Transaction"
import { WalletState } from "../../../domain/ethereum/Models/WalletState"
import { getStatusIcon, getTypeIcon } from "./utils"
import styles from "./index.module.css"
import { sepolia } from "viem/chains"

interface WalletModalProps {
  onClose: () => void
}

export const WalletModal = ({ onClose }: WalletModalProps) => {
  const { t } = useTranslation("common")
  const { wallet, disconnectWallet } = useEthereum()
  const { transactions, cleanTransactions } = useTransactions()

  const iconWallet = wallet.connector?.icon
  const hasTransactions = transactions.items.length > 0

  return (
    <Modal
      onClose={onClose}
      title={wallet.type === WalletState.TYPES.ABSTRACTED ? t("myHumanWallet") : t("yourAccount")}
    >
      <div className={styles.container}>
        <div className={styles.tutBox}>
          <div className={styles.imageWallet}>
            <img src={iconWallet} alt="Wallet icon" />
          </div>
          <div className={styles.addressBox}>
            <div className={styles.chainInfo}>
              <p>{sepolia.name}</p>
            </div>
            <AddressBox account={wallet.account || ""} url={false} />
            <Link target="_blank" to={wallet.explorerUrl}>
              {t("viewInExplorer")}
            </Link>
          </div>
        </div>

        <h3 className={styles.type}>{t("transactions.title")}</h3>

        <div className={styles.transactionsBox}>
          {!hasTransactions ? (
            <p className={styles.noTransactions}>{t("noTransactions")}</p>
          ) : (
            <div className={styles.transactionsList}>
              {transactions.items
                .sort((a, b) => b.date!.getTime() - a.date!.getTime())
                .map((transaction) => (
                  <div
                    className={cx({
                      [styles.pending]:
                        transaction.status === Transaction.STATUS.PENDING ||
                        transaction.status === Transaction.STATUS.EXPIRED,
                      [styles.success]: transaction.status === Transaction.STATUS.SUCCESS,
                      [styles.error]: transaction.status === Transaction.STATUS.REVERTED,
                    })}
                    key={transaction.hash || transaction.userOpHash}
                    onClick={() => window.open(transaction.explorerUrl, "_blank")}
                  >
                    <span className={styles.typeIcon}>{getTypeIcon(transaction.type)}</span>
                    <div className={styles.typeBox}>
                      <span className={styles.type}>{t(`transactions.types.${transaction.type}`)}</span>
                      <span>{transaction.date?.toLocaleString()}</span>
                    </div>
                    <span className={styles.state}>{getStatusIcon(transaction.status)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <Button type="outline" onClick={cleanTransactions} isDisabled={!hasTransactions} isFull>
            {t("clean")}
          </Button>
          <Button
            onClick={() => {
              disconnectWallet()
              onClose()
            }}
            isFull
          >
            {t("disconnect")}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
