import cx from "classnames"
import { useEffect, useState } from "react"
import { useTranslation, Trans } from "react-i18next"
import {
  ArrowLeftIcon,
  Button,
  buttonTypes,
  CamIcon,
  Heading,
  KeyAlertIcon,
  LikeOutlineIcon,
  LoadingBar,
  MultiDeviceIcon,
  PrivacityIcon,
  SelfCustodyIcon,
  ThiefIcon,
  UmbrellaIcon,
  WebIcon,
  Select,
  Modal,
  DefiIcon,
  FingerprintIcon,
  LightningIcon,
  EmojiIcon,
  buttonColors,
  CheckFilledIcon,
} from "@tutellus/tutellus-components"
import { useEthereum } from "../../context"
import { WalletState } from "../../domain/ethereum/Models/WalletState"
import { LANGUAGES } from "../../js/const"
import { ESFlagIcon, ENFlagIcon } from "../../components/Icons"
import { HUMAN_WALLET_BRAND_LOGO_URL, HUMAN_WALLET_LOGO_LARGE_URL, HUMAN_WALLET_LOGO_URL } from "../../js/const/logos"
import styles from "./index.module.css"

const FLAG_ICONS = {
  [LANGUAGES.ES]: <ESFlagIcon />,
  [LANGUAGES.EN]: <ENFlagIcon />,
}

enum ConnectSection {
  Initial = "initial",
  BrowserWallet = "browserWallet",
  AbstractedWallet = "abstractedWallet",
}

export function Component() {
  const { wallet, login, register } = useEthereum()
  const { i18n, t } = useTranslation("login")

  const [showModal, setShowModal] = useState(false)
  const [activeSection, setActiveSection] = useState<ConnectSection>(ConnectSection.Initial)
  const [username, setUsername] = useState("")
  const [showMessage, setShowMessage] = useState(false)

  const isDisconnected = wallet.status === WalletState.STATUS.DISCONNECTED
  const isLoading = wallet.status === WalletState.STATUS.CONNECTING
  const flagIcon = FLAG_ICONS[i18n.language as keyof typeof FLAG_ICONS]

  useEffect(() => {
    if (username.length > 0 && username.length < 3) {
      const timer = setTimeout(() => {
        setShowMessage(true)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setShowMessage(false)
    }
  }, [username])

  const handleReturnToHome = () => {
    setActiveSection(ConnectSection.Initial)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleWalletClick = (section: ConnectSection) => {
    setActiveSection(section)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const [acceptedTerms, setAcceptedTerms] = useState(false)

  if (wallet.status === WalletState.STATUS.CONNECTING || wallet.status === WalletState.STATUS.CONNECTED) {
    return (
      <LoadingBar
        mode="dark"
        isFullScreen
        icon={<img src={HUMAN_WALLET_LOGO_LARGE_URL} alt="logo" className={styles.logo}></img>}
      >
        {t("connect")}
      </LoadingBar>
    )
  }

  return (
    <>
      <div className={"dark"}>
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
              <div className={styles.connectInitial}>
                <img className={styles.logo} src={HUMAN_WALLET_BRAND_LOGO_URL} alt="logo" />
                <Heading as="h1">{t("dex_subtitle")}</Heading>
                <div className={styles.rewards}>
                  <div className={styles.checkIcon}>
                    <CheckFilledIcon />
                  </div>
                  <span>{t("dex_points.point_1")}</span>
                </div>
                <div className={styles.rewards}>
                  <div className={styles.checkIcon}>
                    <CheckFilledIcon />
                  </div>
                  <span>{t("dex_points.point_2")}</span>
                </div>
                <div className={styles.rewards}>
                  <div className={styles.checkIcon}>
                    <CheckFilledIcon />
                  </div>
                  <span>{t("dex_points.point_3")}</span>
                </div>
              </div>
              <div className={styles.connectBrowser}>
                <Heading as="h2">{t("browser_wallet")}</Heading>
                <p>
                  <Trans t={t}>{t("browser_wallet_description")}</Trans>
                </p>
                <h2 className={styles.success}>
                  <span className={styles.iconSmall}>
                    <LikeOutlineIcon />
                  </span>
                  {t("advantages")}
                </h2>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <SelfCustodyIcon />
                  </span>
                  <p>
                    <Trans t={t}>{t("advantage_autocustody")}</Trans>
                  </p>
                </div>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <WebIcon />
                  </span>
                  <p>
                    <Trans t={t}>{t("advantage_versatility")}</Trans>
                  </p>
                </div>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <PrivacityIcon />
                  </span>
                  <p>
                    <Trans t={t}>{t("advantage_privacy")}</Trans>
                  </p>
                </div>
                <h2 className={styles.fail}>
                  <span className={styles.iconSmall}>
                    <LikeOutlineIcon />
                  </span>
                  {t("disadvantages")}
                </h2>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <KeyAlertIcon />
                  </span>

                  <p>
                    <Trans t={t}>{t("disadvantage_key_loss")}</Trans>
                  </p>
                </div>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <ThiefIcon />
                  </span>
                  <p>
                    <Trans t={t}>{t("disadvantage_cyber_attacks")}</Trans>
                  </p>
                </div>
              </div>
              <div className={styles.connectAbstracted}>
                <img className={styles.hwLogo} src={HUMAN_WALLET_BRAND_LOGO_URL} />
                <h2 className={styles.success}>
                  <span className={styles.iconSmall}>
                    <LikeOutlineIcon />
                  </span>
                  {t("advantages")}
                </h2>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <DefiIcon />
                  </span>
                  <p>
                    <Trans t={t}>{t("advantage_mobile")}</Trans>
                  </p>
                </div>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <FingerprintIcon />
                  </span>
                  <p>
                    <Trans t={t}>{t("advantage_biometry")}</Trans>
                  </p>
                </div>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <LightningIcon />
                  </span>
                  <p>
                    <Trans t={t}>{t("advantage_gas")}</Trans>
                  </p>
                </div>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <EmojiIcon />
                  </span>
                  <p>
                    <Trans t={t}>{t("advantage_intuitive")}</Trans>
                  </p>
                </div>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <MultiDeviceIcon />
                  </span>
                  <p>
                    <Trans t={t}>{t("advantage_multidevice")}</Trans>
                  </p>
                </div>
                <h2 className={styles.fail}>
                  <span className={styles.iconSmall}>
                    <LikeOutlineIcon />
                  </span>
                  {t("disadvantages")}
                </h2>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <CamIcon />
                  </span>
                  <p>
                    <Trans t={t}>{t("disadvantage_privacy")}</Trans>
                  </p>
                </div>
                <div className={styles.textIcon}>
                  <span className={styles.iconSmall}>
                    <UmbrellaIcon />
                  </span>
                  <p>
                    <Trans t={t}>{t("disadvantage_light_autocustody")}</Trans>
                  </p>
                </div>
                <div className={styles.seeMore}>
                  <Button type="outline" onClick={() => setShowModal(true)}>
                    {t("learn_more_private_keys")}
                  </Button>
                  {showModal && (
                    <Modal title={t("passkeys_modal_title")} onClose={() => setShowModal(false)}>
                      <div className={styles.modalContent}>
                        <Heading as="h3">{t("passkeys_seed_heading")}</Heading>
                        <p>{t("passkeys_seed_text")}</p>
                        <Heading as="h3">{t("passkeys_key_heading")}</Heading>
                        <p>{t("passkeys_key_text")}</p>
                        <Heading as="h3">{t("passkeys_providers_heading")}</Heading>
                        <p>{t("passkeys_providers_text")}</p>
                        <p>
                          <a href="https://bitwarden.com/" target="_blank" rel="noreferrer">
                            Bitwarden
                          </a>
                          : {t("passkeys_providers_bitwarden")}
                        </p>
                        <p>
                          <a href="https://proton.me/pass" target="_blank" rel="noreferrer">
                            ProtonPass
                          </a>
                          : {t("passkeys_providers_protonpass")}
                        </p>
                      </div>
                    </Modal>
                  )}
                </div>
              </div>
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
                <div className={styles.connectInitial}>
                  <Heading as="h2">{t("try_humanwallet")}</Heading>
                  <p className={cx(styles.intro, styles.noMb)}>{t("try_humanwallet_intro")}</p>
                  <div className={styles.buttonsGrid}>
                    <Button
                      type={buttonTypes.OUTLINE}
                      color={buttonColors.SURFACE_INVERSE}
                      isFull
                      iconLeft={<img src={HUMAN_WALLET_LOGO_URL} />}
                      onClick={() => login({ username })}
                    >
                      {t("connect_abstracted")}
                    </Button>
                    <div className={styles.introHW}>
                      <span>{t("account_HW")} </span>
                      <Button
                        onClick={() => handleWalletClick(ConnectSection.AbstractedWallet)}
                        color={buttonColors.INFO}
                        type={buttonTypes.TEXT}
                      >
                        {t("click_here")}
                      </Button>
                    </div>
                    <div className={styles.createUser}>
                      <p className={styles.mobileText}>
                        <img
                          className={styles.iconMobile}
                          src="https://cdn.prod.website-files.com/64ff0afa9829dccb61ed96ab/679b7dfef0cb7ef9ce5b7f0a_iPhone%2015.png"
                        />
                        <span>{t("create_HW")}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.connectAbstracted}>
                  <div className={styles.connectHeader}>
                    <span className={styles.return} onClick={handleReturnToHome}>
                      <ArrowLeftIcon />
                      {t("return_home")}
                    </span>
                  </div>

                  <div className={styles.buttonsFlex}>
                    <Heading as="h2">{t("register")}</Heading>
                    <p className={styles.intro}>{t("registerText")}</p>
                    <input
                      type="text"
                      className={styles.input}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t("userName")}
                    />
                    <div className={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        id="terms"
                        className={styles.checkbox}
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                      />
                      <label className={styles.labelTerms} htmlFor="terms">
                        {t("disclaimer")}
                      </label>
                    </div>
                    <p className={cx(styles.message, { [styles.show]: showMessage })}>{t("usernameWarning")}</p>
                    {isDisconnected && (
                      <Button onClick={() => register({ username })} isDisabled={username.length < 3 || !acceptedTerms}>
                        {t("register")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {isLoading && <div className={styles.walletItem}>{t("loading")}</div>}
            </div>
          </div>
          <div className={styles.selectLang}>
            <label htmlFor="language" className={styles.labelLang}>
              {flagIcon}
            </label>
            <div className={styles.contentSelect}>
              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => i18n.changeLanguage(e.target.value)}
                id="language"
                options={Object.values(LANGUAGES).map((lang) => ({
                  value: lang,
                  label: t(`languages.${lang}`),
                }))}
                value={i18n.language}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
