// Browser polyfills - initialize Buffer for browser compatibility
import { Buffer } from "buffer"

// Ensure Buffer is available globally in browser environments
if (typeof globalThis !== "undefined" && !(globalThis as any).Buffer) {
  ;(globalThis as any).Buffer = Buffer
}

export * from "./connector"
