import { Routes, Route } from "react-router"
import { Header } from "./components/layout/header"
import Home from "./pages/home"
import Connect from "./pages/connect"
import StakingDemo from "./pages/staking-demo"
import MultiChain from "./pages/multi-chain"

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/staking-demo" element={<StakingDemo />} />
          <Route path="/multi-chain" element={<MultiChain />} />
        </Routes>
      </main>
    </>
  )
}

export default App
