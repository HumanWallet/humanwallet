import "@/app/global.css"
import { RootProvider } from "fumadocs-ui/provider"
import { Inter } from "next/font/google"
import type { Metadata } from "next"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    template: "%s | HumanWallet Docs",
    default: "HumanWallet Docs",
  },
  description: "Modern Web3 wallet infrastructure with biometric authentication and account abstraction",
  keywords: ["Web3", "Wallet", "Biometric", "Account Abstraction", "WebAuthn", "ERC-4337", "Ethereum"],
  authors: [{ name: "HumanWallet Team" }],
  creator: "HumanWallet",
  publisher: "HumanWallet",
  metadataBase: new URL("https://docs.humanwallet.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://docs.humanwallet.com",
    title: "HumanWallet Documentation",
    description: "Modern Web3 wallet infrastructure with biometric authentication and account abstraction",
    siteName: "HumanWallet Docs",
  },
  twitter: {
    card: "summary_large_image",
    title: "HumanWallet Documentation",
    description: "Modern Web3 wallet infrastructure with biometric authentication and account abstraction",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
