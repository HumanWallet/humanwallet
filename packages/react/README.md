# @humanwallet/react

React hooks and components for integrating HumanWallet into React applications.

## Installation

```bash
npm install @humanwallet/react @humanwallet/core @humanwallet/types
```

## Quick Start

### 1. Setup the Provider

Wrap your app with the `HumanWalletProvider`:

```tsx
import React from 'react'
import { HumanWalletProvider } from '@humanwallet/react'
import { createConfig } from '@humanwallet/core'

const config = createConfig({
  passkeyUrl: 'https://your-passkey-server.com',
  bundlerTransport: /* your bundler transport */,
  paymasterTransport: /* your paymaster transport */,
  chain: /* your chain config */,
  publicClient: /* your public client */,
})

function App() {
  return (
    <HumanWalletProvider config={config}>
      <YourApp />
    </HumanWalletProvider>
  )
}
```

### 2. Use Authentication

```tsx
import { useAuth } from "@humanwallet/react"

function LoginComponent() {
  const { login, register, disconnect, reconnect, isConnected, isConnecting, account } = useAuth()

  const handleLogin = async () => {
    try {
      await login("username")
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleRegister = async () => {
    try {
      await register("username")
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  if (isConnecting) {
    return <div>Connecting...</div>
  }

  if (isConnected && account) {
    return (
      <div>
        <p>Connected: {account.address}</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  )
}
```

### 3. Read from Contracts

```tsx
import { useReadContract } from "@humanwallet/react"

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const

function TokenBalance({ address, userAddress }: { address: string; userAddress: string }) {
  const {
    data: balance,
    isLoading,
    error,
  } = useReadContract({
    address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [userAddress],
  })

  if (isLoading) return <div>Loading balance...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>Balance: {balance?.toString()}</div>
}
```

### 4. Write to Contracts

```tsx
import { useWriteContract } from "@humanwallet/react"

const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const

function TransferToken({ tokenAddress }: { tokenAddress: string }) {
  const { write, isLoading, error, isSuccess } = useWriteContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "transfer",
    args: ["0x123...", "1000000000000000000"], // recipient, amount
  })

  const handleTransfer = async () => {
    try {
      await write()
    } catch (error) {
      console.error("Transfer failed:", error)
    }
  }

  return (
    <div>
      <button onClick={handleTransfer} disabled={isLoading}>
        {isLoading ? "Transferring..." : "Transfer Tokens"}
      </button>
      {isSuccess && <div>Transfer successful!</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
```

### 5. Batch Transactions

```tsx
import { useWriteContracts } from "@humanwallet/react"

function BatchTransaction() {
  const { write, isLoading, error, isSuccess } = useWriteContracts([
    {
      address: "0x123...", // Token contract
      abi: ERC20_ABI,
      functionName: "approve",
      args: ["0x456...", "1000000000000000000"], // spender, amount
    },
    {
      address: "0x456...", // DEX contract
      abi: DEX_ABI,
      functionName: "swap",
      args: [
        /* swap parameters */
      ],
    },
  ])

  const handleBatchTransaction = async () => {
    try {
      await write()
    } catch (error) {
      console.error("Batch transaction failed:", error)
    }
  }

  return (
    <div>
      <button onClick={handleBatchTransaction} disabled={isLoading}>
        {isLoading ? "Processing..." : "Approve & Swap"}
      </button>
      {isSuccess && <div>Batch transaction successful!</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
```

## API Reference

### Hooks

#### `useAuth()`

Manages authentication state and operations.

**Returns:**

- `state`: Current authentication state
- `isIdle`: Whether auth is in idle state
- `isConnecting`: Whether currently connecting
- `isConnected`: Whether user is connected
- `isError`: Whether there's an error
- `account`: Current session key account
- `client`: Current kernel client
- `error`: Current error (if any)
- `login(username)`: Login function
- `register(username)`: Register function
- `disconnect()`: Disconnect function
- `reconnect()`: Reconnect function

#### `useAccount()`

Access current account information.

**Returns:**

- `account`: Current session key account
- `address`: Account address
- `isConnected`: Whether account is connected

#### `useConfig()`

Access and update configuration.

**Returns:**

- `config`: Current configuration
- `updateConfig(newConfig)`: Function to update config

#### `useReadContract(parameters, options?)`

Read data from smart contracts.

**Parameters:**

- `parameters`: Contract read parameters
- `options.enabled`: Whether to auto-fetch (default: true)

**Returns:**

- `data`: Contract call result
- `error`: Error (if any)
- `isLoading`: Whether currently loading
- `isSuccess`: Whether call was successful
- `isError`: Whether there's an error
- `refetch()`: Function to refetch data

#### `useWriteContract(parameters)`

Write to smart contracts.

**Parameters:**

- `parameters`: Contract write parameters

**Returns:**

- `data`: Transaction hash
- `error`: Error (if any)
- `isLoading`: Whether transaction is pending
- `isSuccess`: Whether transaction was successful
- `isError`: Whether there's an error
- `write()`: Function to execute transaction
- `reset()`: Function to reset state

#### `useWriteContracts(parameters)`

Execute multiple contract writes in a single transaction.

**Parameters:**

- `parameters`: Array of contract write parameters

**Returns:**
Same as `useWriteContract`

#### `useSignTypedData(parameters)`

Sign typed data (EIP-712).

**Parameters:**

- `parameters`: Typed data parameters

**Returns:**

- `data`: Signature
- `error`: Error (if any)
- `isLoading`: Whether currently signing
- `isSuccess`: Whether signing was successful
- `isError`: Whether there's an error
- `signTypedData()`: Function to sign data
- `reset()`: Function to reset state

#### `useWaitForTransaction()`

Wait for transaction confirmation.

**Returns:**

- `data`: Boolean indicating confirmation
- `error`: Error (if any)
- `isLoading`: Whether waiting for confirmation
- `isSuccess`: Whether transaction was confirmed
- `isError`: Whether there's an error
- `waitForTransaction(hash)`: Function to wait for transaction
- `reset()`: Function to reset state

### Components

#### `HumanWalletProvider`

Context provider for HumanWallet state.

**Props:**

- `config`: HumanWallet configuration
- `children`: React children

## TypeScript Support

All hooks and components are fully typed with TypeScript. The package exports all necessary types for proper type inference.

## Error Handling

All hooks follow a consistent error handling pattern:

- Errors are caught and exposed via the `error` property
- Loading states are provided via `isLoading` properties
- Success states are provided via `isSuccess` properties
- Functions can throw errors that should be caught in user code

## License

MIT
