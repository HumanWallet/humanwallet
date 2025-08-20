import { Outlet, useNavigate } from "react-router"
import { useEthereum } from "../../context"
import { useEffect } from "react"
import { WalletState } from "../../domain/ethereum/Models/WalletState"
// import styles from "./index.module.css"

export function Component() {
  const { wallet } = useEthereum()
  const navidate = useNavigate()

  useEffect(() => {
    if (wallet.status === WalletState.STATUS.DISCONNECTED) navidate("/connect")
    if (wallet.status === WalletState.STATUS.CONNECTED) navidate("/demo")
  }, [wallet.status])

  return <Outlet />
}
