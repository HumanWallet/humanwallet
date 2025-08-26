import cx from "classnames"
import { useState } from "react"
import { useTranslation } from "react-i18next"
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
import { useAccount, useConnect } from "wagmi"

enum ConnectSection {
  Initial = "initial",
  BrowserWallet = "browserWallet",
  AbstractedWallet = "abstractedWallet",
}

export function Component() {
  const { isConnected, isConnecting } = useAccount()

  const { connect, connectors } = useConnect()
  const passkeysWalletConnector = connectors.find((connector) => connector.id === "wallet-passkey")!

  const { i18n, t } = useTranslation("login")

  const [activeSection, setActiveSection] = useState<ConnectSection>(ConnectSection.Initial)

  const isDisconnected = !isConnected
  const isLoading = isConnecting

  const handleReturnToHome = (): void => {
    setActiveSection(ConnectSection.Initial)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleWalletClick = (section: ConnectSection): void => {
    setActiveSection(section)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleConnectAbstracted = (): void => {
    connect({ connector: passkeysWalletConnector })
  }

  const handleLearnMore = (): void => {
    handleWalletClick(ConnectSection.AbstractedWallet)
  }

  const handleRegister = (): void => {
    connect({ connector: passkeysWalletConnector })
  }

  if (isLoading || isConnected) {
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
