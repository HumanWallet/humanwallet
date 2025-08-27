import { mainnet, polygon, sepolia } from "wagmi/chains"
import Ethereum from "../../assets/icons/chains/ethereum.svg"
import Polygon from "../../assets/icons/chains/polygon.svg"
import Sepolia from "../../assets/icons/chains/sepolia.svg"

export const CHAIN_ICONS = {
  [mainnet.id]: Ethereum,
  [polygon.id]: Polygon,
  [sepolia.id]: Sepolia,
}
