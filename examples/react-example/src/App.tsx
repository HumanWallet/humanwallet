import { Routes, Route } from "react-router"
import Connect from "./pages/connect"

function App() {
  return (
    <>
      <header></header>
      <main>
        <Routes>
          <Route path="/" element={<Connect />} />
        </Routes>
      </main>
    </>
  )
}

export default App
