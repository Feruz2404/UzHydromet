/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_USERNAME?: string
  readonly VITE_ADMIN_PASSWORD?: string
  readonly VITE_ADMIN_PIN?: string
  readonly VITE_API_URL?: string
  readonly VITE_PUBLIC_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
