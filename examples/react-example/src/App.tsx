import { Routes, Route } from "react-router"
import { Header } from "./components/layout"
import Home from "./pages/home"
import StakingDemo from "./pages/staking-demo"
import MultiChain from "./pages/multi-chain"
import { PasskeyAuthenticationPage } from "./pages/passkey-authentication"

function App() {
  return (
    <div className="grid min-h-dvh [grid-template-rows:auto_1fr_auto] sm:overflow-y-scroll">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Protected routes */}
          <Route path="/staking-demo" element={<StakingDemo />} />
          <Route path="/multi-chain" element={<MultiChain />} />
          <Route path="/passkey-authentication" element={<PasskeyAuthenticationPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
