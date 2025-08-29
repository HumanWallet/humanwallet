import { Link } from "react-router"
import { Typography } from "@humanwallet/ui"

export function BrandLogo() {
  return (
    <Link to="" className="flex items-center gap-2">
      <img src="/HumanWallet.svg" alt="HumanWallet" className="size-6" />
      <Typography variant="h1">HumanWallet</Typography>
    </Link>
  )
}
