import { useState } from "react"
import { useAccount } from "wagmi"
import { Package, ListChecks, ArrowRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Separator,
} from "@humanwallet/ui"
import { StakingBundle } from "../components/staking/staking-bundle"
import { StakingSteps } from "../components/staking/staking-steps"

export default function StakingDemo() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<"bundle" | "steps">("bundle")

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Web3 Staking Demo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience two different approaches to Web3 interactions: bundled transactions for efficiency or
            step-by-step transactions for clarity and control.
          </p>
          {!isConnected && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Connect your wallet to start the demo
            </Badge>
          )}
        </div>

        {/* Approach Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeTab === "bundle" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setActiveTab("bundle")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Bundle Approach</CardTitle>
                  <CardDescription>Single transaction, multiple operations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span>More gas efficient</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span>Atomic execution (all or nothing)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span>Better user experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="size-2 rounded-full bg-yellow-500" />
                  <span>Requires wallet support for EIP-5792</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeTab === "steps" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setActiveTab("steps")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <ListChecks className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Step-by-Step Approach</CardTitle>
                  <CardDescription>Individual transactions, clear progress</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span>Universal wallet compatibility</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span>Clear progress indication</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span>User can pause at any step</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="size-2 rounded-full bg-orange-500" />
                  <span>Higher gas costs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Interactive Demo */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "bundle" | "steps")}>
          <div className="flex items-center justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="bundle" className="flex items-center gap-2">
                <Package className="size-4" />
                Bundle Demo
              </TabsTrigger>
              <TabsTrigger value="steps" className="flex items-center gap-2">
                <ListChecks className="size-4" />
                Steps Demo
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bundle" className="mt-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Bundle Transaction Demo</h2>
              <p className="text-muted-foreground">
                Execute mint, approve, and stake operations in a single atomic transaction
              </p>
            </div>
            <StakingBundle />
          </TabsContent>

          <TabsContent value="steps" className="mt-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Step-by-Step Demo</h2>
              <p className="text-muted-foreground">Complete each operation individually with clear progress tracking</p>
            </div>
            <StakingSteps />
          </TabsContent>
        </Tabs>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="size-5" />
                EIP-5792 Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Batch multiple contract calls into a single transaction using the latest Ethereum standards. Supported
                by modern wallets like MetaMask and Coinbase Wallet.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListChecks className="size-5" />
                Traditional Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Step-by-step transaction flow that works with all wallets. Each operation requires user confirmation,
                providing maximum transparency and control.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowRight className="size-5" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Choose bundle approach for better UX when supported, fallback to step-by-step for universal
                compatibility. Always provide clear feedback and error handling.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
