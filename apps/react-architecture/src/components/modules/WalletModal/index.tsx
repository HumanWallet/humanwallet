import { useTranslation } from "react-i18next"
import { Modal, AddressBox, Button } from "@tutellus/tutellus-components"
import { Link } from "react-router"
import styles from "./index.module.css"
import { sepolia } from "viem/chains"
import { useAccount, useChainId, useChains, useDisconnect } from "wagmi"

interface WalletModalProps {
  onClose: () => void
}

export const WalletModal = ({ onClose }: WalletModalProps) => {
  const { t } = useTranslation("common")
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const chains = useChains()
  const currentChain = chains.find((chain) => chain.id === chainId)!

  const iconWallet = "wallet.connector?.icon"
  const hasTransactions = false

  return (
    <Modal onClose={onClose} title={t("myHumanWallet")}>
      <div className={styles.container}>
        <div className={styles.tutBox}>
          <div className={styles.imageWallet}>
            <img src={iconWallet} alt="Wallet icon" />
          </div>
          <div className={styles.addressBox}>
            <div className={styles.chainInfo}>
              <p>{sepolia.name}</p>
            </div>
            <AddressBox account={address || ""} url={false} />
            <Link target="_blank" to={currentChain.blockExplorers?.default.url || ""}>
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
              {/*{transactions.items
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
                ))}*/}
            </div>
          )}
        </div>
        <div className={styles.footer}>
          {/*<Button type="outline" onClick={cleanTransactions} isDisabled={!hasTransactions} isFull>
            {t("clean")}
          </Button>*/}
          <Button
            onClick={() => {
              disconnect()
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
