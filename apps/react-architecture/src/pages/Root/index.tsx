import { Outlet, useNavigate } from "react-router"
import { useAuth } from "@humanwallet/react"
import { useEffect } from "react"
// import styles from "./index.module.css"

export function Component() {
  const { isConnected, isConnecting } = useAuth()
  const navidate = useNavigate()

  useEffect(() => {
    if (!isConnected && !isConnecting) navidate("/connect")
    if (isConnected) navidate("/demo")
  }, [isConnected, isConnecting, navidate])

  return <Outlet />
}
