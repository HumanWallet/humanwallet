import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import type { Config, KernelClient, PublicClient, SessionKeyAccount, WebAuthenticationKey } from "types"
import { toPasskeyValidator, PasskeyValidatorContractVersion } from "@zerodev/passkey-validator"
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
  getUserOperationGasPrice,
} from "@zerodev/sdk"
import { getEntryPoint, KERNEL_V3_1 } from "@zerodev/sdk/constants"
import { createAccountAndClient } from "../createAccountAndClient"

// Mock @zerodev/passkey-validator
vi.mock("@zerodev/passkey-validator", () => ({
  toPasskeyValidator: vi.fn(),
  PasskeyValidatorContractVersion: {
    V0_0_2: "V0_0_2",
  },
}))

// Mock @zerodev/sdk
vi.mock("@zerodev/sdk", () => ({
  createKernelAccount: vi.fn(),
  createKernelAccountClient: vi.fn(),
  createZeroDevPaymasterClient: vi.fn(),
  getUserOperationGasPrice: vi.fn(),
}))

// Mock @zerodev/sdk/constants
vi.mock("@zerodev/sdk/constants", () => ({
  getEntryPoint: vi.fn(),
  KERNEL_V3_1: "KERNEL_V3_1",
}))

// Mock the actual functions
const mockToPasskeyValidator = vi.mocked(toPasskeyValidator)
const mockCreateKernelAccount = vi.mocked(createKernelAccount)
const mockCreateKernelAccountClient = vi.mocked(createKernelAccountClient)
const mockCreateZeroDevPaymasterClient = vi.mocked(createZeroDevPaymasterClient)
const mockGetUserOperationGasPrice = vi.mocked(getUserOperationGasPrice)
const mockGetEntryPoint = vi.mocked(getEntryPoint)

describe("createAccountAndClient", () => {
  const mockWebAuthnKey = {} as WebAuthenticationKey
  const mockPublicClient = {} as PublicClient
  const mockSessionKeyAccount = {} as SessionKeyAccount
  const mockKernelClient = {} as KernelClient
  const mockValidator = { someValidatorProperty: "value" }
  const mockPaymasterClient = {
    sponsorUserOperation: vi.fn(),
  }
  const mockEntryPoint = "0xEntryPointAddress"
  const mockGasPrice = "1000000000"

  const mockConfig: Config = {
    passkeyUrl: "https://example.com/passkey",
    bundlerTransport: {} as any,
    paymasterTransport: {} as any,
    chain: {} as any,
    publicClient: mockPublicClient,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mock implementations
    mockGetEntryPoint.mockReturnValue(mockEntryPoint)
    mockToPasskeyValidator.mockResolvedValue(mockValidator)
    mockCreateKernelAccount.mockResolvedValue(mockSessionKeyAccount)
    mockCreateZeroDevPaymasterClient.mockResolvedValue(mockPaymasterClient as any)
    mockCreateKernelAccountClient.mockReturnValue(mockKernelClient)
    mockGetUserOperationGasPrice.mockReturnValue(mockGasPrice)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe("createAccountAndClient", () => {
    it("should create account and client successfully", async () => {
      // Given
      const expectedValidatorCall = {
        webAuthnKey: mockWebAuthnKey,
        entryPoint: mockEntryPoint,
        kernelVersion: "KERNEL_V3_1",
        validatorContractVersion: "V0_0_2",
      }

      const expectedKernelAccountCall = {
        entryPoint: mockEntryPoint,
        plugins: { sudo: mockValidator },
        kernelVersion: "KERNEL_V3_1",
      }

      const expectedPaymasterClientCall = {
        chain: mockConfig.chain,
        transport: mockConfig.paymasterTransport,
      }

      const expectedKernelClientCall = {
        account: mockSessionKeyAccount,
        chain: mockConfig.chain,
        client: mockConfig.publicClient,
        bundlerTransport: mockConfig.bundlerTransport,
        paymaster: {
          getPaymasterData: expect.any(Function),
        },
        userOperation: {
          estimateFeesPerGas: expect.any(Function),
        },
      }

      // When
      const result = await createAccountAndClient(mockWebAuthnKey, mockConfig)

      // Then
      expect(mockToPasskeyValidator).toHaveBeenCalledWith(mockPublicClient, expectedValidatorCall)
      expect(mockCreateKernelAccount).toHaveBeenCalledWith(mockPublicClient, expectedKernelAccountCall)
      expect(mockCreateZeroDevPaymasterClient).toHaveBeenCalledWith(expectedPaymasterClientCall)
      expect(mockCreateKernelAccountClient).toHaveBeenCalledWith(expectedKernelClientCall)
      expect(result).toEqual({
        sessionKeyAccount: mockSessionKeyAccount,
        kernelClient: mockKernelClient,
      })
    })

    it("should call getEntryPoint with correct version", async () => {
      // Given
      const expectedVersion = "0.7"

      // When
      await createAccountAndClient(mockWebAuthnKey, mockConfig)

      // Then
      expect(mockGetEntryPoint).toHaveBeenCalledWith(expectedVersion)
    })

    it("should use correct PasskeyValidatorContractVersion", async () => {
      // Given
      const expectedVersion = "V0_0_2"

      // When
      await createAccountAndClient(mockWebAuthnKey, mockConfig)

      // Then
      expect(mockToPasskeyValidator).toHaveBeenCalledWith(
        mockPublicClient,
        expect.objectContaining({
          validatorContractVersion: expectedVersion,
        })
      )
    })

    it("should use correct KERNEL_V3_1 version", async () => {
      // Given
      const expectedVersion = "KERNEL_V3_1"

      // When
      await createAccountAndClient(mockWebAuthnKey, mockConfig)

      // Then
      expect(mockToPasskeyValidator).toHaveBeenCalledWith(
        mockPublicClient,
        expect.objectContaining({
          kernelVersion: expectedVersion,
        })
      )
      expect(mockCreateKernelAccount).toHaveBeenCalledWith(
        mockPublicClient,
        expect.objectContaining({
          kernelVersion: expectedVersion,
        })
      )
    })

    it("should create paymaster client with correct config", async () => {
      // Given
      const expectedConfig = {
        chain: mockConfig.chain,
        transport: mockConfig.paymasterTransport,
      }

      // When
      await createAccountAndClient(mockWebAuthnKey, mockConfig)

      // Then
      expect(mockCreateZeroDevPaymasterClient).toHaveBeenCalledWith(expectedConfig)
    })

    it("should create kernel client with correct configuration", async () => {
      // Given
      const expectedConfig = {
        account: mockSessionKeyAccount,
        chain: mockConfig.chain,
        client: mockConfig.publicClient,
        bundlerTransport: mockConfig.bundlerTransport,
        paymaster: {
          getPaymasterData: expect.any(Function),
        },
        userOperation: {
          estimateFeesPerGas: expect.any(Function),
        },
      }

      // When
      await createAccountAndClient(mockWebAuthnKey, mockConfig)

      // Then
      expect(mockCreateKernelAccountClient).toHaveBeenCalledWith(expectedConfig)
    })

    it("should return correct session key account and kernel client", async () => {
      // When
      const result = await createAccountAndClient(mockWebAuthnKey, mockConfig)

      // Then
      expect(result).toEqual({
        sessionKeyAccount: mockSessionKeyAccount,
        kernelClient: mockKernelClient,
      })
    })

    it("should handle toPasskeyValidator errors", async () => {
      // Given
      const error = new Error("Validator creation failed")
      mockToPasskeyValidator.mockRejectedValue(error)

      // When & Then
      await expect(createAccountAndClient(mockWebAuthnKey, mockConfig)).rejects.toThrow("Validator creation failed")
      expect(mockToPasskeyValidator).toHaveBeenCalled()
      expect(mockCreateKernelAccount).not.toHaveBeenCalled()
      expect(mockCreateZeroDevPaymasterClient).not.toHaveBeenCalled()
      expect(mockCreateKernelAccountClient).not.toHaveBeenCalled()
    })

    it("should handle createKernelAccount errors", async () => {
      // Given
      const error = new Error("Kernel account creation failed")
      mockCreateKernelAccount.mockRejectedValue(error)

      // When & Then
      await expect(createAccountAndClient(mockWebAuthnKey, mockConfig)).rejects.toThrow("Kernel account creation failed")
      expect(mockToPasskeyValidator).toHaveBeenCalled()
      expect(mockCreateKernelAccount).toHaveBeenCalled()
      expect(mockCreateZeroDevPaymasterClient).not.toHaveBeenCalled()
      expect(mockCreateKernelAccountClient).not.toHaveBeenCalled()
    })

    it("should handle createZeroDevPaymasterClient errors", async () => {
      // Given
      const error = new Error("Paymaster client creation failed")
      mockCreateZeroDevPaymasterClient.mockRejectedValue(error)

      // When & Then
      await expect(createAccountAndClient(mockWebAuthnKey, mockConfig)).rejects.toThrow("Paymaster client creation failed")
      expect(mockToPasskeyValidator).toHaveBeenCalled()
      expect(mockCreateKernelAccount).toHaveBeenCalled()
      expect(mockCreateZeroDevPaymasterClient).toHaveBeenCalled()
      expect(mockCreateKernelAccountClient).not.toHaveBeenCalled()
    })

    it("should handle createKernelAccountClient errors", async () => {
      // Given
      const error = new Error("Kernel client creation failed")
      mockCreateKernelAccountClient.mockImplementation(() => {
        throw error
      })

      // When & Then
      await expect(createAccountAndClient(mockWebAuthnKey, mockConfig)).rejects.toThrow("Kernel client creation failed")
      expect(mockToPasskeyValidator).toHaveBeenCalled()
      expect(mockCreateKernelAccount).toHaveBeenCalled()
      expect(mockCreateZeroDevPaymasterClient).toHaveBeenCalled()
      expect(mockCreateKernelAccountClient).toHaveBeenCalled()
    })
  })
})
