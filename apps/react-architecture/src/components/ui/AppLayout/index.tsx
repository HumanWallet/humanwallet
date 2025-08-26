import { useState } from "react"
import type { ReactNode } from "react"
import { SettingsModal } from "../../modules/SettingsModal"
import { WalletModal } from "../../modules/WalletModal"
import { Topbar } from "../../modules/Topbar"
import { Footer } from "../../modules/Footer"
import styles from "./index.module.css"

interface AppLayoutProps {
  readonly children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [showSettings, setShowSettings] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  return (
    <>
      <div className={styles.layoutContainer}>
        <header className={styles.layoutHeader}>
          <Topbar onShowWalletModal={() => setShowWalletModal(true)} />
        </header>

        <main className={styles.layoutMain}>{children}</main>

        <footer className={styles.layoutFooter}>
          <Footer />
        </footer>

        {showSettings && <SettingsModal onClose={() => setShowSettings(!showSettings)} />}

        {showWalletModal && <WalletModal onClose={() => setShowWalletModal(false)} />}
      </div>
    </>
  )
}
