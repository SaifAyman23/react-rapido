/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  readonly VITE_API_URL?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_ANALYTICS_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
