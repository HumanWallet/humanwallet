import { Routes, Route } from "react-router"
import { Header } from "./components/layout/header"
import Home from "./pages/home"
import Connect from "./pages/connect"
import StakingDemo from "./pages/staking-demo"

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/staking-demo" element={<StakingDemo />} />
        </Routes>
      </main>
    </>
  )
}

export default App
