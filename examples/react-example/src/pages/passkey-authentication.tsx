import { useState } from "react"
import { useAccount, useSignMessage } from "wagmi"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
  Typography,
  Separator,
} from "@humanwallet/ui"
import { Shield, Key, CheckCircle, AlertCircle, Copy, RefreshCw } from "lucide-react"
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard"

export function PasskeyAuthenticationPage() {
  const { address, isConnected } = useAccount()
  const { signMessage, isPending, error } = useSignMessage()
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const [message, setMessage] = useState("I authorize this action with my passkey")
  const [signature, setSignature] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  const handleSignMessage = async (): Promise<void> => {
    if (!message.trim()) return

    try {
      await signMessage(
        { message },
        {
          onSuccess: (signature) => {
            setSignature(signature)
            setIsVerified(true)
          },
        },
      )
    } catch (err) {
      console.error("Failed to sign message:", err)
      setIsVerified(false)
    }
  }

  const handleReset = (): void => {
    setSignature(null)
    setIsVerified(false)
    setMessage("I authorize this action with my passkey")
  }

  const generateRandomMessage = (): void => {
    const actions = [
      "I authorize this transaction",
      "I confirm this operation",
      "I approve this action",
      "I verify my identity",
      "I authenticate this request",
    ]
    const timestamp = new Date().toISOString()
    const randomAction = actions[Math.floor(Math.random() * actions.length)]
    setMessage(`${randomAction} at ${timestamp}`)
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mx-auto mb-6">
            <Shield className="h-8 w-8 text-muted-foreground" />
          </div>
          <Typography variant="h2" className="mb-4">
            Passkey Authentication Demo
          </Typography>
          <Typography variant="lead" className="mb-6 text-center max-w-2xl mx-auto">
            Connect your wallet to explore passkey-based message signing
          </Typography>
          <Typography variant="muted">Please connect your HumanWallet to access this demonstration</Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-6">
          <Key className="h-8 w-8 text-primary" />
        </div>
        <Typography variant="h2" className="mb-4">
          Passkey Authentication Demo
        </Typography>
        <Typography variant="lead" className="text-center max-w-2xl mx-auto">
          Demonstrate secure message signing using your passkey authentication
        </Typography>
      </div>

      <div className="grid gap-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <CardTitle className="text-lg">Connected Wallet</CardTitle>
                <CardDescription>Ready for passkey authentication</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <Typography variant="small" className="font-mono">
                {address}
              </Typography>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(address || "")} className="h-8 w-8 p-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Message Signing Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Message Signing
            </CardTitle>
            <CardDescription>Sign a custom message using your passkey for authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Message Input */}
            <div className="space-y-2">
              <Typography variant="small" className="font-medium">
                Message to Sign
              </Typography>
              <div className="flex gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  className="flex-1 min-h-[80px] px-3 py-2 text-sm bg-background border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  disabled={isPending}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateRandomMessage}
                  disabled={isPending}
                  className="self-start"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleSignMessage} disabled={isPending || !message.trim()} className="flex-1">
                {isPending ? (
                  <>
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Sign with Passkey
                  </>
                )}
              </Button>
              {signature && (
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <Typography variant="small" className="font-medium mb-1">
                    Signing Failed
                  </Typography>
                  <Typography variant="muted" className="text-sm">
                    {error.message}
                  </Typography>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Signature Result */}
        {signature && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isVerified ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning" />
                )}
                Signature Result
              </CardTitle>
              <CardDescription>
                {isVerified
                  ? "Message successfully signed with your passkey"
                  : "Signature generated but verification pending"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Typography variant="small" className="font-medium mb-2 block">
                    Original Message
                  </Typography>
                  <div className="p-3 bg-muted rounded-lg">
                    <Typography variant="muted" className="text-sm break-words">
                      {message}
                    </Typography>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Typography variant="small" className="font-medium">
                      Digital Signature
                    </Typography>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(signature)} className="h-8 px-2">
                      {isCopied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <Typography variant="muted" className="text-xs font-mono break-all">
                      {signature}
                    </Typography>
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <Typography variant="small" className="font-medium mb-1">
                    Cryptographic Proof
                  </Typography>
                  <Typography variant="muted" className="text-sm">
                    This signature proves that the message was signed by the holder of the private key associated with
                    your passkey, without revealing the private key itself.
                  </Typography>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How Passkey Authentication Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0">
                  <Typography variant="muted" className="text-xs font-bold">
                    1
                  </Typography>
                </div>
                <Typography variant="muted">
                  Your passkey is stored securely in your device&apos;s hardware security module
                </Typography>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0">
                  <Typography variant="muted" className="text-xs font-bold">
                    2
                  </Typography>
                </div>
                <Typography variant="muted">
                  When signing, your device authenticates you using biometrics or PIN
                </Typography>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0">
                  <Typography variant="muted" className="text-xs font-bold">
                    3
                  </Typography>
                </div>
                <Typography variant="muted">
                  The signature is created without exposing your private key to the browser
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
