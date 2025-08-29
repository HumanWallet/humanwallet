# HumanWallet

> **Modern Web3 wallet infrastructure with biometric authentication and account abstraction**

HumanWallet is a comprehensive Web3 wallet solution that combines **WebAuthn passkey authentication** with **account abstraction (ERC-4337)** to deliver a seamless, secure, and user-friendly blockchain experience. Built on top of ZeroDev infrastructure, it enables gasless transactions and biometric signing across any EVM-compatible blockchain.

## ✨ Key Features

### 🔐 **Biometric Authentication**
- **Passkey Integration**: WebAuthn-based authentication using FaceID, TouchID, or device PIN
- **No Seed Phrases**: Eliminate the complexity and risk of traditional private key management
- **Device Security**: Leverage built-in device security features for transaction signing

### 🛡️ **Account Abstraction (ERC-4337)**
- **Gasless Transactions**: Sponsor user transactions with configurable paymaster integration
- **Smart Contract Wallets**: Each wallet is a smart contract with advanced features
- **Batch Operations**: Execute multiple transactions in a single user operation

### 🌐 **Universal Compatibility**
- **EVM Blockchains**: Works with any Ethereum Virtual Machine compatible network
- **Wagmi Integration**: Drop-in replacement for traditional wallet connectors
- **Multi-platform**: Browser, mobile web, and desktop support

### 🔧 **Developer Experience**
- **TypeScript First**: Fully typed APIs with comprehensive documentation
- **Modular Architecture**: Use individual packages or the complete SDK
- **Wagmi Compatible**: Drop-in replacement for traditional wallet connectors

## 🏗️ Architecture

HumanWallet is built as a monorepo with modular packages:

```
humanwallet/
├── packages/
│   ├── connector/     # Wagmi connector for HumanWallet
│   ├── core/          # Core functionality and business logic
│   ├── types/         # Shared TypeScript type definitions
│   └── sdk/           # High-level SDK combining all packages
├── apps/
│   ├── domain-architecture/  # Domain-driven architecture demo
│   └── react-architecture/   # React-based demo application
└── examples/
    └── react-example/   # Integration example with React + Vite
```

### Package Overview

| Package | Description | Key Features |
|---------|-------------|--------------|
| `@humanwallet/connector` | Wagmi-compatible wallet connector | WebAuthn auth, account abstraction, transaction handling |
| `@humanwallet/core` | Core business logic and actions | Ethereum interactions, key management, domain architecture |
| `@humanwallet/types` | Shared TypeScript definitions | Type safety across all packages |
| `@humanwallet/sdk` | Unified SDK interface | High-level API combining all functionality |

## 🚀 Quick Start

### Installation

```bash
npm install @humanwallet/connector viem wagmi
```

### Basic Integration

```typescript
import { humanWalletConnector } from '@humanwallet/connector'
import { createConfig } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'

// Configure the HumanWallet connector
const connector = humanWalletConnector({
  projectId: 'your-zerodev-project-id', // Get from ZeroDev dashboard
  appName: 'My DApp',
  dappMetadata: {
    name: 'My DApp',
    url: 'https://mydapp.com',
    iconUrl: 'https://mydapp.com/icon.png',
    description: 'Your Web3 application'
  },
  logging: {
    developerMode: true // Enable for development
  }
})

// Create wagmi config
const config = createConfig({
  chains: [mainnet, polygon],
  connectors: [connector],
  // ... other wagmi configuration
})
```

### React Component Usage

```tsx
import { useConnect, useAccount } from 'wagmi'

function ConnectWallet() {
  const { connect, connectors } = useConnect()
  const { address } = useAccount()

  const humanWallet = connectors.find(c => c.id === 'humanWallet')

  if (address) {
    return <div>Connected: {address}</div>
  }

  return (
    <button 
      onClick={() => connect({ connector: humanWallet })}
    >
      Connect with HumanWallet
    </button>
  )
}
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm
- ZeroDev Project ID ([Get one here](https://dashboard.zerodev.app/))

### Setup

```bash
# Clone the repository
git clone https://github.com/HumanWallet/humanwallet.git
cd humanwallet

# Install dependencies
npm install

# Build all packages
npm run build

# Run the example application
cd examples/react-example
npm run dev
```

### Project Scripts

```bash
# Build all packages
npm run build

# Run tests across all packages
npm run test

# Lint and format code
npm run lint
npm run format

# Type checking
npm run typecheck
```

## 🔑 Core Concepts

### WebAuthn Passkeys
HumanWallet uses WebAuthn passkeys instead of traditional private keys. This provides:
- **Enhanced Security**: Keys are stored in secure hardware enclaves
- **Better UX**: No seed phrases to remember or store safely
- **Cross-device**: Sync across devices via platform providers (Apple, Google)

### Account Abstraction
Built on ERC-4337 standard:
- **Smart Contract Wallets**: Each wallet is a customizable smart contract
- **Gasless Transactions**: Optional gas sponsorship via paymasters
- **Batch Operations**: Multiple operations in single transaction
- **Social Recovery**: Advanced account recovery mechanisms (coming soon)

### ZeroDev Integration
Powered by ZeroDev infrastructure:
- **Bundler Network**: Reliable UserOperation processing
- **Paymaster Services**: Flexible gas sponsorship options
- **Passkey Services**: Secure WebAuthn key management

## 📚 Documentation

- **API Reference**: Comprehensive TypeScript documentation in each package
- **Examples**: Complete integration examples in `/examples`
- **Demo Apps**: Two full-featured demo applications in `/apps`

## 🔄 Supported RPC Methods

The HumanWallet connector supports standard Ethereum RPC methods:

- `eth_sendTransaction` - Send transactions with automatic gas sponsorship
- `personal_sign` - Sign messages with biometric confirmation
- `wallet_sendCalls` - Batch multiple operations (EIP-5792)
- `eth_accounts` - Get connected account addresses
- `eth_chainId` - Get current chain ID

## 🏗️ Technology Stack

- **TypeScript**: Type-safe development across all packages
- **Viem**: Modern Ethereum library for type-safe blockchain interactions
- **Wagmi**: React hooks for Ethereum, providing the connector interface
- **ZeroDev SDK**: Account abstraction and passkey infrastructure
- **React**: UI framework for demo applications and examples
- **Vitest**: Fast unit testing framework

## 🔐 Security

- **WebAuthn Standard**: Uses W3C WebAuthn specification for secure authentication
- **EIP-6492**: Smart contract signature verification standard
- **Hardware Security**: Private keys stored in device secure enclaves
- **Audited Dependencies**: Built on audited ZeroDev and Viem foundations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and code of conduct.

## 🆘 Support

- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides and API reference
- **Community**: Join our Discord for discussions and support

---

**Built with ❤️ by the HumanWallet team**
