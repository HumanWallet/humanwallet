import { getWebAuthenticationKey } from "../lib/getWebAuthenticationKey"

export const hasAccount = async () => {
  return !!(await getWebAuthenticationKey())
}
