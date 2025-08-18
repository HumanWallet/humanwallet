# My Web3 SDK

A modern TypeScript SDK for Ethereum and ERC20 token interactions, built with Viem for optimal performance and type safety.

## Features

- 🚀 **Fast & Lightweight**: Built with Viem for optimal performance
- 🔒 **Type Safe**: Full TypeScript support with strict typing
- 🌐 **Multi-Chain**: Support for any EVM-compatible blockchain
- 💰 **Native & ERC20**: Handle both ETH and token operations
- 🧪 **Well Tested**: Comprehensive test suite with Vitest
- 📦 **Tree Shakeable**: ES modules for optimal bundle size

## Installation

```bash
# npm
npm install web3-sdk

# yarn
yarn add web3-sdk

# pnpm
pnpm add web3-sdk
```

## Quick Start

### Basic Setup

```typescript
import { HumanWalletSDK, ERC20 } from 'web3-sdk';

// Initialize SDK with your RPC endpoint
const sdk = new HumanWalletSDK({
  rpcUrl: 'https://rpc.sepolia.org',
  chainId: 11155111, // Sepolia testnet
});

// Connect wallet using private key
sdk.connectWithPrivateKey('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
```

### Check Native ETH Balance

```typescript
// Get ETH balance for any address
const address = '0x742d35Cc6634C0532925a3b8D84c18cE3f8f6FD8';
const balance = await sdk.getNativeBalance(address);

console.log(`Balance: ${balance} wei`);
// Convert to ETH: Number(balance) / 10^18
```

### Send Native ETH

```typescript
try {
  const recipient = '0x123456789abcdef123456789abcdef123456789a';
  const amountEth = '0.1'; // 0.1 ETH
  
  const result = await sdk.sendNativeToken(recipient, amountEth);
  console.log(`Transaction sent! Hash: ${result.hash}`);
} catch (error) {
  console.error('Transaction failed:', error.message);
}
```

### ERC20 Token Operations

```typescript
// Initialize ERC20 handler
const erc20 = new ERC20(sdk);

// Check token balance
const tokenAddress = '0xA0b86a33E6441d0bd3e34a8AD9C6b2Ec6A43b1d2';
const userAddress = '0x742d35Cc6634C0532925a3b8D84c18cE3f8f6FD8';

const tokenBalance = await erc20.getBalance(tokenAddress, userAddress);
console.log(`Token balance: ${tokenBalance}`);

// Transfer tokens
const recipient = '0x123456789abcdef123456789abcdef123456789a';
const amount = BigInt('1000000000000000000'); // 1 token (assuming 18 decimals)

try {
  const txHash = await erc20.transfer(tokenAddress, recipient, amount);
  console.log(`Tokens transferred! Hash: ${txHash}`);
} catch (error) {
  console.error('Transfer failed:', error.message);
}
```

## Advanced Usage

### Multiple Networks

```typescript
// Mainnet
const mainnetSdk = new HumanWalletSDK({
  rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
  chainId: 1,
});

// Polygon
const polygonSdk = new HumanWalletSDK({
  rpcUrl: 'https://polygon-rpc.com',
  chainId: 137,
});

// Arbitrum
const arbitrumSdk = new HumanWalletSDK({
  rpcUrl: 'https://arb1.arbitrum.io/rpc',
  chainId: 42161,
});
```

### Error Handling

```typescript
try {
  const balance = await sdk.getNativeBalance(address);
  console.log('Balance:', balance);
} catch (error) {
  if (error.message.includes('Wallet no conectada')) {
    console.error('Please connect your wallet first');
  } else if (error.message.includes('insufficient funds')) {
    console.error('Insufficient balance for transaction');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

### Batch Operations

```typescript
// Check multiple token balances
const tokenAddresses = [
  '0xA0b86a33E6441d0bd3e34a8AD9C6b2Ec6A43b1d2',
  '0xB0b86a33E6441d0bd3e34a8AD9C6b2Ec6A43b1d3',
  '0xC0b86a33E6441d0bd3e34a8AD9C6b2Ec6A43b1d4',
];

const balances = await Promise.all(
  tokenAddresses.map(token => 
    erc20.getBalance(token, userAddress)
  )
);

console.log('All token balances:', balances);
```

## Configuration

### SDK Configuration

```typescript
interface SDKConfig {
  rpcUrl: string;    // Your RPC endpoint
  chainId: number;   // Chain ID (1 for mainnet, 11155111 for Sepolia)
}
```

### Supported Networks

| Network | Chain ID | RPC URL Example |
|---------|----------|-----------------|
| Ethereum Mainnet | 1 | `https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY` |
| Sepolia Testnet | 11155111 | `https://rpc.sepolia.org` |
| Polygon | 137 | `https://polygon-rpc.com` |
| Arbitrum | 42161 | `https://arb1.arbitrum.io/rpc` |
| Base | 8453 | `https://mainnet.base.org` |

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building

```bash
# Build for production
npm run build

# Build in watch mode
npm run dev
```

## API Reference

### HumanWalletSDK Class

- `constructor(config: SDKConfig)` - Initialize SDK
- `connectWithPrivateKey(privateKey: \`0x${string}\`)` - Connect wallet
- `getNativeBalance(address: \`0x${string}\`)` - Get ETH balance
- `sendNativeToken(to: \`0x${string}\`, amountEth: string)` - Send ETH

### ERC20 Class

- `constructor(sdk: HumanWalletSDK)` - Initialize ERC20 handler
- `getBalance(token: Address, address: Address)` - Get token balance
- `transfer(token: Address, to: Address, amount: bigint)` - Transfer tokens

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Viem and TypeScript**
