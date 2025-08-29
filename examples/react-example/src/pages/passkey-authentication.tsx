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
  const { address } = useAccount()
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
          onError: (error) => {
            console.error("Failed to sign message:", error)
            setIsVerified(false)
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

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 mx-auto mb-4 sm:mb-6">
          <Key className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <Typography variant="h2" className="mb-3 sm:mb-4 text-xl sm:text-3xl">
          Passkey Authentication Demo
        </Typography>
        <Typography variant="lead" className="text-center max-w-2xl mx-auto text-base sm:text-xl px-2">
          Demonstrate secure message signing using your passkey authentication
        </Typography>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <CardTitle className="text-lg">Connected Wallet</CardTitle>
                <CardDescription className="text-sm sm:text-base">Ready for passkey authentication</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-muted rounded-lg">
              <Typography variant="small" className="font-mono text-xs sm:text-sm truncate mr-2">
                {address}
              </Typography>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(address || "")}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
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
                  className="flex-1 min-h-[80px] sm:min-h-[100px] px-2 sm:px-3 py-2 text-xs sm:text-sm bg-background border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  disabled={isPending}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateRandomMessage}
                  disabled={isPending}
                  className="self-start p-2"
                >
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSignMessage}
                disabled={isPending || !message.trim()}
                className="flex-1 h-10 sm:h-auto"
              >
                {isPending ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                    <span className="text-sm sm:text-base">Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="text-sm sm:text-base">Sign with Passkey</span>
                  </>
                )}
              </Button>
              {signature && (
                <Button variant="outline" onClick={handleReset} className="h-10 sm:h-auto">
                  <span className="text-sm sm:text-base">Reset</span>
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
