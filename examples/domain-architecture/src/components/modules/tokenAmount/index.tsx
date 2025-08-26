import React from "react"
import { ETHIcon } from "@tutellus/tutellus-components"
import { TOKEN_NAME, TOKEN_SYMBOL } from "./config"
import styles from "./index.module.css"

interface TokenAmountProps {
  amount: number
}

export const TokenAmount: React.FC<TokenAmountProps> = ({ amount }) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <ETHIcon />
      </div>
      <div className={styles.infoContainer}>
        <span className={styles.name}>{TOKEN_NAME}</span>
        <span className={styles.symbol}>{TOKEN_SYMBOL}</span>
      </div>
      <div className={styles.amount}>{amount}</div>
    </div>
  )
}
