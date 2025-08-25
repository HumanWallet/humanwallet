import cx from "classnames"
import { useEffect, useState } from "react"
import { Button, buttonTypes, buttonSizes, SettingsIcon, Spinner, buttonColors } from "@tutellus/tutellus-components"
import { useAuth, useAccount } from "@humanwallet/react"
import type { Transaction } from "../../../domain/ethereum/Models/Transaction"
import { truncateAddress } from "../../../js/string"
import { HUMAN_WALLET_BRAND_LOGO_URL } from "../../../js/const/logos"
import styles from "./index.module.css"

interface TopbarProps {
  onShowWalletModal: () => void
  pendingTransactions: Transaction[]
}

export const Topbar = ({ onShowWalletModal, pendingTransactions }: TopbarProps) => {
  const { isConnected } = useAuth()
  const { address } = useAccount()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const hasPendingTransactions = pendingTransactions.length > 0
  const walletFormatted = address ? truncateAddress(address) : ""
  const iconWallet = "https://humanwallet.io/favicon.ico" // HumanWallet icon

  return (
    <div className={cx(styles.topbar, { [styles.scrolled]: isScrolled })}>
      <div className={styles.topbarContent}>
        <div className={styles.logo}>
          <img className={styles.logoDesktop} src={HUMAN_WALLET_BRAND_LOGO_URL} alt="logo" />
          <img className={styles.logoMobile} src={HUMAN_WALLET_BRAND_LOGO_URL} alt="logo" />
        </div>
        <div className={styles.rightContent}>
          {isConnected && (
            <Button
              onClick={onShowWalletModal}
              type={buttonTypes.OUTLINE}
              size={buttonSizes.SMALL}
              color={buttonColors.SURFACE_INVERSE}
              iconLeft={hasPendingTransactions ? <Spinner size="m" /> : <img src={iconWallet} alt="Wallet icon" />}
              hideTextOnMobile
            >
              {walletFormatted}
            </Button>
          )}
          <div className={styles.settings}>
            <SettingsIcon />
          </div>
        </div>
      </div>
    </div>
  )
}
