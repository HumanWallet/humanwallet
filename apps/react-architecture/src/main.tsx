import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router"
import "./index.css"
import "./i18n.config"
import { Component as ErrorPage } from "./pages/Error"
import { Component as LayoutPage } from "./pages/Layout"
import { Component as RootPage } from "./pages/Root"
import { WagmiProvider } from "wagmi"
import { config } from "./wagmi/config"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route id="root" errorElement={<ErrorPage />} element={<RootPage />}>
        <Route path="connect" id="connect" lazy={async () => import("./pages/Connect")} />
        <Route element={<LayoutPage />}>
          <Route index element={<Navigate to="demo" />} />
          <Route path="demo" id="demo" lazy={async () => import("./pages/Demo")} />
        </Route>
      </Route>
    </>,
  ),
)

const App = () => {
  return (
    <React.StrictMode>
      <WagmiProvider config={config}>
        <RouterProvider router={router} />
      </WagmiProvider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
