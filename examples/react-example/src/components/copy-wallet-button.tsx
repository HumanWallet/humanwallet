"use client"

import { Check } from "lucide-react"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { useTruncateAddress } from "@/hooks/use-truncate-address"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface CopyWalletbutton {
  address: string
  ensAvatar?: string
  ensName?: string
}

export function CopyWalletbutton({ address, ensName, ensAvatar: avatar }: CopyWalletbutton) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const truncatedAddress = useTruncateAddress(address)

  return (
    <div className="text-foreground hover:text-primary dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex w-fit items-center justify-center gap-2 overflow-hidden rounded-full border shadow-xs transition-all">
      <TooltipProvider key={ensName}>
        <Tooltip open={isCopied}>
          <TooltipTrigger asChild>
            <span
              onClick={() => copyToClipboard(truncatedAddress)}
              className="flex h-9 cursor-pointer items-center overflow-hidden px-4 py-2 text-sm font-medium text-ellipsis whitespace-nowrap"
            >
              {truncatedAddress}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3" />
              <span>Address copied!</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider key={"ensAvatar"}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="h-9 w-9 cursor-default transition-transform duration-200 hover:scale-110 hover:rotate-3">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-accent">{truncatedAddress.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          {ensName && (
            <TooltipContent>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3" />
                <span>{ensName}</span>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
