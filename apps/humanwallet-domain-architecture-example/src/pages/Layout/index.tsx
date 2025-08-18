import { useState } from "react"
import { Outlet } from "react-router"
import { SettingsModal } from "../../components/modules/SettingsModal"
import { WalletModal } from "../../components/modules/WalletModal"
import { Topbar } from "../../components/modules/Topbar"
import { Footer } from "../../components/modules/Footer"
import { useTransactions } from "../../context"
import styles from "./index.module.css"

export function Component() {
  const { transactions } = useTransactions()

  const [showSettings, setShowSettings] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  return (
    <>
      <div className={styles.layoutContainer}>
        <header className={styles.layoutHeader}>
          <Topbar pendingTransactions={transactions.pending} onShowWalletModal={() => setShowWalletModal(true)} />
        </header>
        <main className={styles.layoutMain}>
          <Outlet />
        </main>
        <footer className={styles.layoutFooter}>
          <Footer />
        </footer>
        {showSettings && <SettingsModal onClose={() => setShowSettings(!showSettings)} />}
        {showWalletModal && <WalletModal onClose={() => setShowWalletModal(false)} />}
      </div>
    </>
  )
}
