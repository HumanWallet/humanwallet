import { Routes, Route } from "react-router"
import { Header } from "./components/layout/header"
import { AuthProvider } from "./context/auth-context"
import { ProtectedRoute } from "./components/auth/protected-route"
import Home from "./pages/home"
import Connect from "./pages/connect"
import StakingDemo from "./pages/staking-demo"
import MultiChain from "./pages/multi-chain"

function App() {
  return (
    <AuthProvider>
      <div className="grid min-h-dvh [grid-template-rows:auto_1fr_auto]">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connect" element={<Connect />} />
            <Route
              path="/staking-demo"
              element={
                <ProtectedRoute>
                  <StakingDemo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/multi-chain"
              element={
                <ProtectedRoute>
                  <MultiChain />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
