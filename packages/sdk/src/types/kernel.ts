import type { createKernelAccount, createKernelAccountClient } from "@zerodev/sdk"

/**
 * A Kernel client that provides account abstraction functionality.
 * Used for sending user operations and managing smart contract accounts.
 */
export type KernelClient = ReturnType<typeof createKernelAccountClient>

/**
 * A Kernel account that represents a smart contract account.
 * Provides methods for encoding calls and managing account state.
 */
export type KernelAccount = ReturnType<typeof createKernelAccount>
