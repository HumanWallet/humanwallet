import { Outlet } from "react-router"
import { AppLayout } from "../../components/ui"

export function Component() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
