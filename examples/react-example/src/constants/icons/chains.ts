import { mainnet, polygon, sepolia } from "wagmi/chains"
import Ethereum from "../../../public/icons/chains/ethereum.svg"
import Polygon from "../../../public/icons/chains/polygon.svg"
import Sepolia from "../../../public/icons/chains/sepolia.svg"

export const CHAIN_ICONS = {
  [mainnet.id]: Ethereum,
  [polygon.id]: Polygon,
  [sepolia.id]: Sepolia,
}
