import { deleteWebAuthenticationKey } from "../lib/deleteWebAuthenticationKey"

export const disconnect = async (): Promise<boolean> => {
  return await deleteWebAuthenticationKey()
}
