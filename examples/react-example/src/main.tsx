import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router"
import { WagmiProviders } from "./wagmi/provider"
import { ThemeProvider } from "./components/theme-provider"
import App from "./App"
import "../../../packages/ui/src/styles/globals.css"
import "./app.css"

const root = document.getElementById("root")

ReactDOM.createRoot(root!).render(
  <BrowserRouter>
    <WagmiProviders>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </WagmiProviders>
  </BrowserRouter>,
)
