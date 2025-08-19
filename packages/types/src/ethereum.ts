import type {
  Chain as ViemChain,
  PublicClient as ViemPublicClient,
  Transport as ViemTransport,
  WriteContractParameters as ViemWriteContractParameters,
  ReadContractParameters as ViemReadContractParameters,
  SignTypedDataParameters as ViemSignTypedDataParameters,
  Signature as ViemSignature,
} from "viem"

export type Chain = ViemChain
export type PublicClient = ViemPublicClient
export type Transport = ViemTransport
export type Address = `0x${string}`
export type Hash = `0x${string}`
export type Signature = ViemSignature
export type UserOperationHash = `0x${string}`
export type WriteContractParameters = ViemWriteContractParameters
export type ReadContractParameters = ViemReadContractParameters
export type SignTypedDataParameters = ViemSignTypedDataParameters
