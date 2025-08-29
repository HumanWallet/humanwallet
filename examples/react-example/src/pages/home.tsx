import { ConnectDialog } from "@/components/layout"
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@humanwallet/ui"
import { TrendingUp, Network } from "lucide-react"
import { Link } from "react-router"
import { useAccount } from "wagmi"

export default function Home() {
  const { isDisconnected } = useAccount()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to HumanWallet</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of Web3 with secure, passwordless authentication and account abstraction
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Abstraction</CardTitle>
              <CardDescription>Experience gasless transactions powered by account abstraction</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="size-5" />
                Staking Demo
              </CardTitle>
              <CardDescription>Try both bundle and step-by-step staking approaches</CardDescription>
            </CardHeader>
            <CardContent>
              {isDisconnected ? (
                <ConnectDialog>
                  <Button size="sm" className="w-full">
                    Try Demo
                  </Button>
                </ConnectDialog>
              ) : (
                <Button size="sm" className="w-full" asChild>
                  <Link to="/staking-demo">Try Demo</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Network className="size-5" />
                Multi-Chain Support
              </CardTitle>
              <CardDescription>Switch between networks and manage cross-chain assets</CardDescription>
            </CardHeader>
            <CardContent>
              {isDisconnected ? (
                <ConnectDialog>
                  <Button size="sm" className="w-full">
                    Explore Networks
                  </Button>
                </ConnectDialog>
              ) : (
                <Button size="sm" className="w-full" asChild>
                  <Link to="/multi-chain">Explore Networks</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Recovery</CardTitle>
              <CardDescription>Secure wallet recovery through trusted contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Passkey Authentication</CardTitle>
              <CardDescription>Secure, passwordless login using biometric authentication</CardDescription>
            </CardHeader>
            <CardContent>
              {isDisconnected ? (
                <ConnectDialog>
                  <Button size="sm" className="w-full">
                    Try Now
                  </Button>
                </ConnectDialog>
              ) : (
                <Button size="sm" className="w-full" asChild>
                  <Link to="/connect">Try Now</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Multi-Chain Support</CardTitle>
              <CardDescription>Connect to multiple blockchain networks seamlessly</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">DeFi Integration</CardTitle>
              <CardDescription>Access decentralized finance protocols with ease</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
