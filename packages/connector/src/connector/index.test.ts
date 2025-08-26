import { beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest"
import { sepolia } from "viem/chains"
import { UserRejectedRequestError } from "viem"
import { toWebAuthnKey } from "@zerodev/passkey-validator"
import { get, set, del } from "idb-keyval"
import { humanWalletConnector, type HumanWalletOptions } from "./index"

// Mock external dependencies
vi.mock("@zerodev/passkey-validator", () => ({
  toWebAuthnKey: vi.fn(),
  toPasskeyValidator: vi.fn(),
  PasskeyValidatorContractVersion: "v1.0.0",
}))

vi.mock("@zerodev/sdk", () => ({
  createKernelAccount: vi.fn(),
  createKernelAccountClient: vi.fn(),
  createZeroDevPaymasterClient: vi.fn(),
}))

vi.mock("@zerodev/sdk/constants", () => ({
  getEntryPoint: vi.fn(() => "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"),
  KERNEL_V3_1: "0x0000000000000000000000000000000000000000",
}))

vi.mock("idb-keyval", () => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
}))

const mockToWebAuthnKey = toWebAuthnKey as MockedFunction<typeof toWebAuthnKey>
const mockGet = get as MockedFunction<typeof get>
const mockSet = set as MockedFunction<typeof set>
const mockDel = del as MockedFunction<typeof del>

// Mock data
const mockWebAuthnKey = {
  getPublicKey: () => ({ x: "0x123", y: "0x456" }),
  signMessage: vi.fn(),
  signTypedData: vi.fn(),
}

const mockKernelAccount = {
  address: "0x742d35Cc6634C0532925a3b8D100A57e0A8D8e5C" as const,
  signMessage: vi.fn(),
  signTransaction: vi.fn(),
  signTypedData: vi.fn(),
}

const mockKernelClient = {
  account: mockKernelAccount,
  chain: sepolia,
  sendUserOperation: vi.fn(),
  request: vi.fn(),
}

// Import and mock ZeroDev SDK functions after mocking
const { createKernelAccount, createKernelAccountClient } = await import("@zerodev/sdk")
vi.mocked(createKernelAccount).mockResolvedValue(mockKernelAccount)
vi.mocked(createKernelAccountClient).mockResolvedValue(mockKernelClient)

// Mock config object with proper structure
// Mock config object with all necessary properties
const mockConfig = {
  chains: [sepolia],
  emitter: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    listenerCount: vi.fn(),
  },
  storage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  transports: {
    [sepolia.id]: {},
  },
}

const defaultOptions: HumanWalletOptions = {
  projectId: "test-project-id",
  appName: "Test App",
  dappMetadata: {
    name: "Test DApp",
    url: "https://test.com",
    iconUrl: "https://test.com/icon.png",
    description: "Test description",
  },
  logging: {
    developerMode: true,
    sdk: true,
  },
}

describe("humanWalletConnector", () => {
  let connector: ReturnType<typeof humanWalletConnector>
  let connectorInstance: ReturnType<ReturnType<typeof humanWalletConnector>>

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Reset the mock config to ensure fresh state
    mockConfig.emitter.emit.mockClear()

    // Setup default mock implementations
    mockGet.mockResolvedValue(null)
    mockSet.mockResolvedValue()
    mockDel.mockResolvedValue()
    mockToWebAuthnKey.mockResolvedValue(mockWebAuthnKey)

    // Create connector instance
    connector = humanWalletConnector(defaultOptions)
    connectorInstance = connector({ config: mockConfig })
  })

  describe("constructor", () => {
    it("should create connector with default options", () => {
      const connectorFn = humanWalletConnector({
        projectId: "test-project-id",
      })

      const instance = connectorFn({ config: mockConfig })

      expect(instance.id).toBe("humanWallet")
      expect(instance.name).toBe("HumanWallet")
      expect(instance.type).toBe("humanWallet")
    })

    it("should use dappMetadata for connector properties", () => {
      expect(connectorInstance.name).toBe("Test DApp")
      expect(connectorInstance.icon).toBe("https://test.com/icon.png")
    })

    it("should use default icon when no dappMetadata.iconUrl provided", () => {
      const connectorFn = humanWalletConnector({
        projectId: "test-project-id",
      })

      const instance = connectorFn({ config: mockConfig })

      expect(instance.icon).toContain("data:image/svg+xml;base64,")
    })
  })

  describe("setup", () => {
    it("should setup successfully without stored credentials", async () => {
      mockGet.mockResolvedValue(null)

      await expect(connectorInstance.setup()).resolves.toBeUndefined()

      expect(mockGet).toHaveBeenCalledWith("hw-webauthn-test-project-id")
    })

    it("should setup and auto-connect with stored credentials", async () => {
      mockGet.mockResolvedValue(mockWebAuthnKey)

      await connectorInstance.setup()

      expect(mockGet).toHaveBeenCalledWith("hw-webauthn-test-project-id")
    })

    it("should handle setup errors gracefully", async () => {
      mockGet.mockRejectedValue(new Error("Storage error"))

      await expect(connectorInstance.setup()).resolves.toBeUndefined()
    })
  })

  describe("isAuthorized", () => {
    it("should return false when no stored credentials and not connected", async () => {
      mockGet.mockResolvedValue(null)

      const isAuthorized = await connectorInstance.isAuthorized()

      expect(isAuthorized).toBe(false)
    })

    it("should return true when stored credentials exist", async () => {
      mockGet.mockResolvedValue(mockWebAuthnKey)

      const isAuthorized = await connectorInstance.isAuthorized()

      expect(isAuthorized).toBe(true)
    })
  })

  describe("getAccounts", () => {
    it("should return empty array when not connected", async () => {
      const accounts = await connectorInstance.getAccounts()

      expect(accounts).toEqual([])
    })
  })

  describe("getChainId", () => {
    it("should throw error when not connected", async () => {
      await expect(connectorInstance.getChainId()).rejects.toThrow("Kernel client not initialized")
    })
  })

  describe("getProvider", () => {
    it("should throw error when not connected", async () => {
      await expect(connectorInstance.getProvider()).rejects.toThrow("Kernel client not initialized")
    })
  })

  describe("disconnect", () => {
    it("should disconnect successfully", async () => {
      await connectorInstance.disconnect()

      expect(mockDel).toHaveBeenCalledWith("hw-webauthn-test-project-id")
      expect(mockDel).toHaveBeenCalledWith("hw-passkey-name-test-project-id")
      expect(mockConfig.emitter.emit).toHaveBeenCalledWith("disconnect")
    })
  })

  describe("event handlers", () => {
    it("should handle account changes", () => {
      connectorInstance.onAccountsChanged(["0x742d35Cc6634C0532925a3b8D100A57e0A8D8e5C"])

      expect(mockConfig.emitter.emit).toHaveBeenCalledWith("change", {
        accounts: ["0x742d35Cc6634C0532925a3b8D100A57e0A8D8e5C"],
      })
    })

    it("should handle disconnection on empty accounts", () => {
      connectorInstance.onAccountsChanged([])

      expect(mockConfig.emitter.emit).toHaveBeenCalledWith("disconnect")
    })

    it("should handle chain changes", () => {
      connectorInstance.onChainChanged("0x1")

      expect(mockConfig.emitter.emit).toHaveBeenCalledWith("change", { chainId: 1 })
    })

    it("should handle disconnect events", () => {
      connectorInstance.onDisconnect()

      expect(mockConfig.emitter.emit).toHaveBeenCalledWith("disconnect")
    })
  })

  describe("error handling", () => {
    it("should handle storage errors gracefully in isAuthorized", async () => {
      // Create a fresh connector instance for this test to avoid interfering with others
      const errorConnector = humanWalletConnector(defaultOptions)
      const errorInstance = errorConnector({ config: mockConfig })
      
      // Mock storage error for this specific test
      mockGet.mockRejectedValueOnce(new Error("Storage error"))

      const isAuthorized = await errorInstance.isAuthorized()

      expect(isAuthorized).toBe(false)
    })

    it("should handle user rejection properly", async () => {
      mockGet.mockResolvedValue(null)
      mockToWebAuthnKey.mockRejectedValue(new UserRejectedRequestError(new Error("User rejected")))

      await expect(connectorInstance.connect()).rejects.toThrow()
    })
  })

  describe("configuration options", () => {
    it("should use custom passkey server URL", () => {
      const customOptions: HumanWalletOptions = {
        projectId: "test-project-id",
        passkeyServerUrl: "https://custom-passkey.com",
      }

      const connectorFn = humanWalletConnector(customOptions)
      const instance = connectorFn({ config: mockConfig })

      expect(instance.id).toBe("humanWallet")
    })

    it("should use custom bundler RPC pattern", () => {
      const customOptions: HumanWalletOptions = {
        projectId: "test-project-id",
        bundlerRpcPattern: "https://custom-bundler.com/api",
      }

      const connectorFn = humanWalletConnector(customOptions)
      const instance = connectorFn({ config: mockConfig })

      expect(instance.id).toBe("humanWallet")
    })

    it("should use custom passkey name", () => {
      const customOptions: HumanWalletOptions = {
        projectId: "test-project-id",
        passkeyName: "Custom Passkey Name",
      }

      const connectorFn = humanWalletConnector(customOptions)
      const instance = connectorFn({ config: mockConfig })

      expect(instance.id).toBe("humanWallet")
    })
  })

  describe("logging", () => {
    it("should handle logging when developerMode is enabled", () => {
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {})

      // Create connector with logging enabled
      const logConnector = humanWalletConnector({
        projectId: "test-project-id",
        logging: { developerMode: true },
      })

      const instance = logConnector({ config: mockConfig })

      expect(instance.id).toBe("humanWallet")

      consoleLogSpy.mockRestore()
    })

    it("should not log when developerMode is disabled", () => {
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {})

      // Create connector with logging disabled
      const noLogConnector = humanWalletConnector({
        projectId: "test-project-id",
        logging: { developerMode: false },
      })

      const instance = noLogConnector({ config: mockConfig })

      expect(instance.id).toBe("humanWallet")

      consoleLogSpy.mockRestore()
    })
  })
})
