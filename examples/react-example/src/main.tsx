import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router"
import { WagmiProviders } from "./wagmi/provider"
import App from "./App"
import "./index.css"

const root = document.getElementById("root")

ReactDOM.createRoot(root!).render(
  <BrowserRouter>
    <WagmiProviders>
      <App />
    </WagmiProviders>
  </BrowserRouter>,
)
