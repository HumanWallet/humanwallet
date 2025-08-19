import { getWebAuthenticationKey } from "../lib/webAuthenticationKey"

export const hasAccount = async () => {
  return !!(await getWebAuthenticationKey())
}
