import { LoadingBar } from "@tutellus/tutellus-components"
import { HUMAN_WALLET_LOGO_LARGE_URL } from "../../../js/const/logos"
import styles from "./index.module.css"

interface LoadingScreenProps {
  readonly message: string
}

export const LoadingScreen = ({ message }: LoadingScreenProps) => {
  return (
    <LoadingBar
      mode="dark"
      isFullScreen
      icon={<img src={HUMAN_WALLET_LOGO_LARGE_URL} alt="logo" className={styles.logo} />}
    >
      {message}
    </LoadingBar>
  )
}
