export const capitalizaFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
export const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`
export const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)
