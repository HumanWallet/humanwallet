import { Coins } from "lucide-react"
import { cn } from "@humanwallet/ui"

interface TokenAmountProps {
  readonly amount: number
  readonly symbol?: string
  readonly className?: string
  readonly size?: "sm" | "md" | "lg"
}

export const TokenAmount = ({ amount, symbol = "TKN", className, size = "md" }: TokenAmountProps) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg font-semibold",
  }

  const iconSizes = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  }

  return (
    <div className={cn("flex items-center justify-center gap-2 rounded-lg bg-muted p-3", className)}>
      <Coins className={cn("text-muted-foreground", iconSizes[size])} />
      <span className={cn("font-medium text-foreground", sizeClasses[size])}>
        {amount.toLocaleString()} {symbol}
      </span>
    </div>
  )
}
