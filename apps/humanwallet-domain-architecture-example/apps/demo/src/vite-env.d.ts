/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string
  readonly VITE_CHAIN_ID: string
  readonly VITE_ZERODEV_PROJECT_ID: string
  readonly VITE_ZERODEV_BUNDLER_RPC: string
  readonly VITE_ZERODEV_PAYMASTER_RPC: string
  readonly VITE_ZERODEV_PASSKEY_URL: string
  readonly VITE_OPENSEA_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
