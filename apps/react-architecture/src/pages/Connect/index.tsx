import cx from "classnames"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useEthereum } from "../../context"
import { WalletState } from "../../domain/ethereum/Models/WalletState"
import {
  LanguageSelector,
  LoadingScreen,
  InitialSection,
  InitialSectionRight,
  BrowserWalletSection,
  AbstractedWalletSection,
  ConnectionForm,
} from "../../components/ui"
import styles from "./index.module.css"

enum ConnectSection {
  Initial = "initial",
  BrowserWallet = "browserWallet",
  AbstractedWallet = "abstractedWallet",
}

export function Component() {
  const { wallet, login, register } = useEthereum()
  const { i18n, t } = useTranslation("login")

  const [activeSection, setActiveSection] = useState<ConnectSection>(ConnectSection.Initial)

  const isDisconnected = wallet.status === WalletState.STATUS.DISCONNECTED
  const isLoading = wallet.status === WalletState.STATUS.CONNECTING

  const handleReturnToHome = (): void => {
    setActiveSection(ConnectSection.Initial)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleWalletClick = (section: ConnectSection): void => {
    setActiveSection(section)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleConnectAbstracted = (): void => {
    login({ username: "" })
  }

  const handleLearnMore = (): void => {
    handleWalletClick(ConnectSection.AbstractedWallet)
  }

  const handleRegister = (username: string): void => {
    register({ username })
  }

  if (isLoading || wallet.status === WalletState.STATUS.CONNECTED) {
    return <LoadingScreen message={t("connect")} />
  }

  return (
    <>
      <div className="dark">
        <div
          className={cx(styles.page, {
            [styles.browserWallet]: activeSection === ConnectSection.BrowserWallet,
            [styles.abstractedWallet]: activeSection === ConnectSection.AbstractedWallet,
          })}
        >
          <div className={styles.left}>
            <div
              className={cx(styles.typeContainer, {
                [styles.activeInitial]: activeSection === ConnectSection.Initial,
                [styles.activeBrowser]: activeSection === ConnectSection.BrowserWallet,
                [styles.activeAbstracted]: activeSection === ConnectSection.AbstractedWallet,
              })}
            >
              {activeSection === ConnectSection.Initial && <InitialSection t={t} />}
              {activeSection === ConnectSection.BrowserWallet && <BrowserWalletSection t={t} />}
              {activeSection === ConnectSection.AbstractedWallet && <AbstractedWalletSection t={t} />}
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.box}>
              <div
                className={cx(styles.typeContainer, {
                  [styles.activeInitial]: activeSection === ConnectSection.Initial,
                  [styles.activeBrowser]: activeSection === ConnectSection.BrowserWallet,
                  [styles.activeAbstracted]: activeSection === ConnectSection.AbstractedWallet,
                })}
              >
                {activeSection === ConnectSection.Initial && (
                  <InitialSectionRight
                    onConnectAbstracted={handleConnectAbstracted}
                    onLearnMore={handleLearnMore}
                    t={t}
                  />
                )}
                {activeSection === ConnectSection.AbstractedWallet && (
                  <ConnectionForm
                    onReturnToHome={handleReturnToHome}
                    onRegister={handleRegister}
                    isDisabled={!isDisconnected}
                    t={t}
                  />
                )}
              </div>
              {isLoading && <div className={styles.walletItem}>{t("loading")}</div>}
            </div>
          </div>

          <LanguageSelector
            currentLanguage={i18n.language}
            onLanguageChange={(language) => i18n.changeLanguage(language)}
            t={t}
          />
        </div>
      </div>
    </>
  )
}
