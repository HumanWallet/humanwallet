import { deleteWebAuthenticationKey } from "../lib/webAuthenticationKey"

export const disconnect = async (): Promise<boolean> => {
  return await deleteWebAuthenticationKey()
}
