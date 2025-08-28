import { Routes, Route } from "react-router"
import { Header } from "./components/layout/header"
import Home from "./pages/home"
import Connect from "./pages/connect"

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connect" element={<Connect />} />
        </Routes>
      </main>
    </>
  )
}

export default App
