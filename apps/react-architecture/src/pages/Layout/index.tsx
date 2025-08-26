import { Outlet } from "react-router"
import { useTransactions } from "../../context"
import { AppLayout } from "../../components/ui"

export function Component() {
  const { transactions } = useTransactions()

  return (
    <AppLayout pendingTransactions={transactions.pending}>
      <Outlet />
    </AppLayout>
  )
}
