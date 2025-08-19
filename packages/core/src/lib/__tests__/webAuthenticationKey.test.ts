import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import type { Config, WebAuthenticationKey, WebAuthenticationModeKey, Transport, Chain, PublicClient } from "types"
import { WEB_AUTHENTICATION_MODE_KEY } from "types"
import { get, set, del } from "idb-keyval"
import { toWebAuthnKey } from "@zerodev/webauthn-key"
import {
  deleteWebAuthenticationKey,
  setWebAuthenticationKey,
  getWebAuthenticationKey,
  generateWebAuthenticationKey,
} from "../webAuthenticationKey"

// Mock idb-keyval library
vi.mock("idb-keyval", () => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
}))

// Mock @zerodev/webauthn-key library
vi.mock("@zerodev/webauthn-key", () => ({
  toWebAuthnKey: vi.fn(),
  WebAuthnMode: {
    Register: "register",
    Login: "login",
  },
}))

// Mock the actual functions
const mockGet = vi.mocked(get)
const mockSet = vi.mocked(set)
const mockDel = vi.mocked(del)
const mockToWebAuthnKey = vi.mocked(toWebAuthnKey)

describe("webAuthenticationKey", () => {
  const mockWebAuthenticationKey = {} as WebAuthenticationKey

  const mockConfig: Config = {
    passkeyUrl: "https://example.com/passkey",
    bundlerTransport: {} as Transport,
    paymasterTransport: {} as Transport,
    chain: {} as Chain,
    publicClient: {} as PublicClient,
  }

  const mockMode: WebAuthenticationModeKey = WEB_AUTHENTICATION_MODE_KEY.REGISTER

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe("deleteWebAuthenticationKey", () => {
    it("should delete the web authentication key and return true", async () => {
      // Arrange
      mockDel.mockResolvedValue(undefined)

      // Act
      const result = await deleteWebAuthenticationKey()

      // Assert
      expect(mockDel).toHaveBeenCalledWith("webAuthnKey")
      expect(result).toBe(true)
    })

    it("should handle deletion errors gracefully", async () => {
      // Arrange
      const error = new Error("IndexedDB error")
      mockDel.mockRejectedValue(error)

      // Act & Assert
      await expect(deleteWebAuthenticationKey()).rejects.toThrow("IndexedDB error")
      expect(mockDel).toHaveBeenCalledWith("webAuthnKey")
    })
  })

  describe("setWebAuthenticationKey", () => {
    it("should set the web authentication key successfully", async () => {
      // Arrange
      mockSet.mockResolvedValue(undefined)

      // Act
      await setWebAuthenticationKey(mockWebAuthenticationKey)

      // Assert
      expect(mockSet).toHaveBeenCalledWith("webAuthnKey", mockWebAuthenticationKey)
    })

    it("should handle setting errors", async () => {
      // Arrange
      const error = new Error("Storage error")
      mockSet.mockRejectedValue(error)

      // Act & Assert
      await expect(setWebAuthenticationKey(mockWebAuthenticationKey)).rejects.toThrow("Storage error")
      expect(mockSet).toHaveBeenCalledWith("webAuthnKey", mockWebAuthenticationKey)
    })
  })

  describe("getWebAuthenticationKey", () => {
    it("should retrieve the web authentication key successfully", async () => {
      // Arrange
      mockGet.mockResolvedValue(mockWebAuthenticationKey)

      // Act
      const result = await getWebAuthenticationKey()

      // Assert
      expect(mockGet).toHaveBeenCalledWith("webAuthnKey")
      expect(result).toEqual(mockWebAuthenticationKey)
    })

    it("should return undefined when no key exists", async () => {
      // Arrange
      mockGet.mockResolvedValue(undefined)

      // Act
      const result = await getWebAuthenticationKey()

      // Assert
      expect(mockGet).toHaveBeenCalledWith("webAuthnKey")
      expect(result).toBeUndefined()
    })

    it("should handle retrieval errors", async () => {
      // Arrange
      const error = new Error("Retrieval error")
      mockGet.mockRejectedValue(error)

      // Act & Assert
      await expect(getWebAuthenticationKey()).rejects.toThrow("Retrieval error")
      expect(mockGet).toHaveBeenCalledWith("webAuthnKey")
    })
  })

  describe("generateWebAuthenticationKey", () => {
    it("should generate a web authentication key successfully", async () => {
      // Arrange
      const username = "testuser"
      mockToWebAuthnKey.mockResolvedValue(mockWebAuthenticationKey)

      // Act
      const result = await generateWebAuthenticationKey(username, mockMode, mockConfig)

      // Assert
      expect(mockToWebAuthnKey).toHaveBeenCalledWith({
        passkeyName: username,
        passkeyServerUrl: mockConfig.passkeyUrl,
        mode: mockMode,
        passkeyServerHeaders: {},
      })
      expect(result).toEqual(mockWebAuthenticationKey)
    })

    it("should handle generation errors", async () => {
      // Arrange
      const username = "testuser"
      const error = new Error("Generation error")
      mockToWebAuthnKey.mockRejectedValue(error)

      // Act & Assert
      await expect(generateWebAuthenticationKey(username, mockMode, mockConfig)).rejects.toThrow("Generation error")

      expect(mockToWebAuthnKey).toHaveBeenCalledWith({
        passkeyName: username,
        passkeyServerUrl: mockConfig.passkeyUrl,
        mode: mockMode,
        passkeyServerHeaders: {},
      })
    })

    it("should call toWebAuthnKey with correct parameters for different modes", async () => {
      // Arrange
      const username = "testuser"
      const loginMode: WebAuthenticationModeKey = WEB_AUTHENTICATION_MODE_KEY.LOGIN
      mockToWebAuthnKey.mockResolvedValue(mockWebAuthenticationKey)

      // Act
      await generateWebAuthenticationKey(username, loginMode, mockConfig)

      // Assert
      expect(mockToWebAuthnKey).toHaveBeenCalledWith({
        passkeyName: username,
        passkeyServerUrl: mockConfig.passkeyUrl,
        mode: loginMode,
        passkeyServerHeaders: {},
      })
    })

    it("should use the correct config passkeyUrl", async () => {
      // Arrange
      const username = "testuser"
      const customConfig: Config = {
        ...mockConfig,
        passkeyUrl: "https://custom.example.com/passkey",
      }
      mockToWebAuthnKey.mockResolvedValue(mockWebAuthenticationKey)

      // Act
      await generateWebAuthenticationKey(username, mockMode, customConfig)

      // Assert
      expect(mockToWebAuthnKey).toHaveBeenCalledWith({
        passkeyName: username,
        passkeyServerUrl: "https://custom.example.com/passkey",
        mode: mockMode,
        passkeyServerHeaders: {},
      })
    })
  })
})
