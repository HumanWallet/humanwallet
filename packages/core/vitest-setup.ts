// vitest-setup.ts
import indexeddb from "fake-indexeddb"
import { vi } from "vitest"

globalThis.indexedDB = indexeddb

// Mock @zerodev/webauthn-key to prevent real network calls
vi.mock("@zerodev/webauthn-key", () => ({
  toWebAuthnKey: vi.fn().mockResolvedValue({
    id: "mocked-key-id",
    name: "mocked-key-name",
    // Add other properties that WebAuthenticationKey might need
  }),
  WebAuthnMode: {
    Register: "register",
    Login: "login",
  },
}))

// Mock specific viem functions to prevent real network calls
vi.mock("viem", async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import("viem")>()

  // Create a mock transport that doesn't make real network calls
  const mockTransport = () => ({
    request: vi.fn().mockResolvedValue("0x0000000000000000000000000000000000000000000000000000000000000001"),
    type: "http",
    url: "http://localhost:8545",
  })

  return {
    ...actual,
    createPublicClient: vi.fn().mockReturnValue({
      request: vi.fn().mockResolvedValue("0x0000000000000000000000000000000000000000000000000000000000000001"),
      type: "public",
      waitForTransactionReceipt: vi.fn().mockResolvedValue({
        hash: "0x123",
        status: "success",
      }),
    }),
    http: vi.fn().mockReturnValue(mockTransport()),
  }
})

function fakeSignature(): `0x${string}` {
  const r = "a".repeat(64) // 32 bytes
  const s = "b".repeat(64) // 32 bytes
  const v = "1b" // 27 in hex
  return `0x${r}${s}${v}` as `0x${string}`
}

// Mock ZeroDev SDK functions to return mock objects
vi.mock("@zerodev/sdk", () => ({
  createKernelAccount: vi.fn().mockResolvedValue({
    address: "0x1234567890123456789012345678901234567890",
    entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    type: "kernel",
  }),
  createKernelAccountClient: vi.fn().mockReturnValue({
    account: {
      signTypedData: vi.fn().mockResolvedValue(fakeSignature()),
      encodeCalls: vi.fn().mockResolvedValue("0x0000000000000000000000000000000000000000000000000000000000000001"),
    },
    waitForUserOperationReceipt: vi.fn().mockResolvedValue({
      hash: "0x123",
      status: "success",
      blockNumber: 1,
      blockHash: "0x123",
      transactionHash: "0x123",
      transactionIndex: 0,
      from: "0x1234567890123456789012345678901234567890",
    }),
    chain: "sepolia",
    type: "kernel",
    sendUserOperation: vi.fn().mockResolvedValue("0xhash"),
  }),
  createZeroDevPaymasterClient: vi.fn().mockResolvedValue({
    sponsorUserOperation: vi.fn().mockResolvedValue({
      paymasterAndData: "0x0000000000000000000000000000000000000000000000000000000000000001",
      preVerificationGas: "0x0",
      verificationGasLimit: "0x0",
      callGasLimit: "0x0",
    }),
  }),
  getUserOperationGasPrice: vi.fn().mockResolvedValue({
    maxFeePerGas: "0x0",
    maxPriorityFeePerGas: "0x0",
  }),
}))

// Mock ZeroDev passkey validator
vi.mock("@zerodev/passkey-validator", () => ({
  toPasskeyValidator: vi.fn().mockResolvedValue({
    address: "0x1234567890123456789012345678901234567890",
    type: "passkey-validator",
  }),
  PasskeyValidatorContractVersion: {
    V0_0_2: "0.0.2",
  },
}))
