import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router"
import { HumanWalletProvider } from "@humanwallet/react"
import "./index.css"
import "./i18n.config"
import { DomainContext, LayoutContext, TransactionsContext } from "./context"
import { createHumanWalletConfig } from "./config/humanwallet"
import { Component as ErrorPage } from "./pages/Error"
import { Component as LayoutPage } from "./pages/Layout"
import { Component as RootPage } from "./pages/Root"

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
  const config = createHumanWalletConfig()

  return (
    <React.StrictMode>
      <DomainContext>
        <HumanWalletProvider config={config}>
          <LayoutContext>
            <TransactionsContext>
              <RouterProvider router={router} />
            </TransactionsContext>
          </LayoutContext>
        </HumanWalletProvider>
      </DomainContext>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
