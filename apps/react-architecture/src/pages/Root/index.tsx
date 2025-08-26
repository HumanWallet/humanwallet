import { Outlet, useNavigate } from "react-router"
import { useEffect } from "react"
import { useAccount } from "wagmi"
// import styles from "./index.module.css"

export function Component() {
  const { isConnected } = useAccount()
  const navidate = useNavigate()

  useEffect(() => {
    if (!isConnected) navidate("/connect")
    if (isConnected) navidate("/demo")
  }, [isConnected])

  return <Outlet />
}
