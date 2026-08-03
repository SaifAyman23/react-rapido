import { defineConfig } from 'vitest/config'
import { loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

const DEFAULT_SITE_URL = "https://example.com"

const SITEMAP_PATHS = [
  { path: "/", priority: "1.0" },
  { path: "/login", priority: "0.5" },
  { path: "/register", priority: "0.5" },
  { path: "/forgot-password", priority: "0.3" },
]

function siteFiles(siteUrl: string): Plugin {
  const url = siteUrl.replace(/\/+$/, "")
  return {
    name: "site-files",
    apply: "build",
    generateBundle() {
      const robots = ["User-agent: *", "Allow: /", `Sitemap: ${url}/sitemap.xml`].join("\n") + "\n"
      const urls = SITEMAP_PATHS
        .map(({ path: p, priority }) => `  <url><loc>${url}${p}</loc><priority>${priority}</priority></url>`)
        .join("\n")
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots })
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const siteUrl = env.VITE_SITE_URL || DEFAULT_SITE_URL

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      tailwindcss(),
      siteFiles(siteUrl),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 550,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-query': ['@tanstack/react-query'],
            'vendor-radix': ['@radix-ui/react-tabs', '@radix-ui/react-slot', '@radix-ui/react-label'],
            'vendor-motion': ['motion'],
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup-env.ts', './src/test/setup.ts'],
      css: false,
    },
  }
})
