import { TrendingUp, Wallet, Network, CircleCheckIcon, CircleIcon } from "lucide-react"
import { Link } from "react-router"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@humanwallet/ui"

export function MainNavigation() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className={navigationMenuTriggerStyle()}>
            <CircleIcon className="size-4 mr-2" />
            Home
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
            <CircleCheckIcon className="size-4 mr-2" />
            Demo
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-1 w-[400px]">
              <NavigationMenuLink asChild>
                <Link to="/staking-demo">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4" />
                    <div className="text-sm font-medium leading-none">Staking Demo</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Experience both bundle and step-by-step staking workflows
                  </p>
                </Link>
              </NavigationMenuLink>

              <NavigationMenuLink asChild>
                <Link to="/connect">
                  <div className="flex items-center gap-2">
                    <Wallet className="size-4" />
                    <div className="text-sm font-medium leading-none">Connect Wallet</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Try passwordless authentication with passkeys
                  </p>
                </Link>
              </NavigationMenuLink>

              <NavigationMenuLink asChild>
                <Link to="/multi-chain">
                  <div className="flex items-center gap-2">
                    <Network className="size-4" />
                    <div className="text-sm font-medium leading-none">Multi-Chain</div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Switch between networks and manage cross-chain assets
                  </p>
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
