import { Abi } from "viem"

export const STAKING_ABI: Abi = [
  {
    type: "constructor",
    inputs: [{ name: "_token", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deposit",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  { type: "function", name: "depositAll", inputs: [], outputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    stateMutability: "view",
  },
]
