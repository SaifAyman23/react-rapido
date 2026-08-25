import { ArrowUpRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F2F0E9] text-black selection:bg-black selection:text-white">
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border-[3px] focus:border-black focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-bold focus:shadow-[4px_4px_0_#000]"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b-[3px] border-black bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center border-[3px] border-black bg-black text-white">
              <span className="font-mono text-[11px] font-black leading-none">
                RR
                <br />
                01
              </span>
            </div>
            <span className="font-mono text-sm font-black tracking-[0.14em]">REACT RAPIDO</span>
            <span className="hidden border-l-[3px] border-black pl-3 font-mono text-[10px] leading-none tracking-widest sm:block">
              V1.0
              <br />
              2026
            </span>
          </div>
          <nav className="hidden items-center gap-2 font-mono text-xs font-bold sm:flex">
            <a
              href="https://github.com/SaifAyman23/react-rapido"
              target="_blank"
              rel="noreferrer"
              className="border-[3px] border-black bg-white px-3 py-1.5 shadow-[3px_3px_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000]"
            >
              GITHUB [02]
            </a>
            <Link
              to={ROUTES.LOGIN}
              className="border-[3px] border-black bg-black px-3 py-1.5 text-white shadow-[3px_3px_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000]"
            >
              DEMO →
            </Link>
          </nav>
          <Link
            to={ROUTES.LOGIN}
            className="border-[3px] border-black bg-black px-3 py-1.5 font-mono text-xs font-black text-white shadow-[3px_3px_0_#000] sm:hidden"
          >
            DEMO
          </Link>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <section className="mx-auto max-w-[1280px] border-x-[3px] border-black bg-white">
          <div className="grid md:grid-cols-[1.35fr_0.85fr]">
            <div className="border-b-[3px] border-black p-6 sm:p-10 md:border-b-0 md:border-r-[3px]">
              <div className="inline-flex items-center gap-2 border-[3px] border-black bg-violet-500 px-3 py-1 font-mono text-[11px] font-black tracking-widest text-white shadow-[3px_3px_0_#000]">
                <Zap className="h-3 w-3" />
                READY TO SHIP
              </div>

              <h1 className="mt-6 font-black leading-[0.88] tracking-[-0.04em]">
                <span className="block font-mono text-[13px] tracking-[0.32em] text-zinc-500">
                  001 STARTER KIT
                </span>
                <span className="mt-3 block text-[clamp(2.8rem,9vw,5.8rem)]">BUILD</span>
                <span className="block bg-black px-2 py-1 text-[clamp(2.8rem,9vw,5.8rem)] text-white">
                  FASTER.
                </span>
                <span className="mt-2 block font-mono text-[clamp(1rem,2.2vw,1.35rem)] font-bold leading-8 tracking-tight">
                  React 19 + TS + Vite 7 + Tailwind v4.{' '}
                  <span className="inline-block whitespace-nowrap bg-violet-500 px-1.5 py-0.5 leading-none text-white [box-decoration-break:clone]">
                    Let&apos;s go
                  </span>
                </span>
              </h1>

              <p className="mt-6 max-w-[52ch] border-l-[4px] border-black pl-4 font-mono text-[13px] leading-6 text-zinc-700">
                Pages stay thin. Components take props. API follows the same three files. Auth and
                SEO already handled. You handle the product.
                <br />
                <span className="font-black">Clean and fast.</span>
              </p>

              <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs font-black">
                <Link
                  to={ROUTES.REGISTER}
                  className="inline-flex items-center gap-2 border-[3px] border-black bg-black px-5 py-3 text-white shadow-[5px_5px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]"
                >
                  GET STARTER <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href="#stack"
                  className="inline-flex items-center gap-2 border-[3px] border-black bg-white px-5 py-3 shadow-[5px_5px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]"
                >
                  VIEW STACK [03]
                </a>
              </div>

              <div className="mt-8 grid grid-cols-3 divide-x-[3px] divide-black border-[3px] border-black bg-white font-mono text-xs">
                {[
                  ['LCP', '≤2.5s', 'GOOD'],
                  ['CLS', '0.00', 'PERFECT'],
                  ['TBT', '≤200ms', 'FAST'],
                ].map(([k, v, s]) => (
                  <div key={k} className="p-3">
                    <div className="text-[10px] tracking-widest text-zinc-500">{k}</div>
                    <div className="text-sm font-black">{v}</div>
                    <div className="text-[10px] font-black text-emerald-600">{s}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F2F0E9] p-4 sm:p-6">
              <div className="border-[3px] border-black bg-white shadow-[8px_8px_0_#000]">
                <div className="flex items-center justify-between border-b-[3px] border-black bg-black px-3 py-2 text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 border border-white bg-red-500" />
                    <span className="h-3 w-3 border border-white bg-yellow-400" />
                    <span className="h-3 w-3 border border-white bg-green-500" />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest">
                    ~/ src/pages/Home.tsx — npm run dev
                  </span>
                </div>
                <div className="p-4 font-mono text-[12px] leading-5">
                  <div className="text-zinc-500">// create → ship</div>
                  <div>
                    <span className="text-zinc-500">$</span> npx degit SaifAyman23/react-rapido
                    my-app
                  </div>
                  <div>
                    <span className="text-zinc-500">$</span> npm i && npm run dev
                  </div>
                  <div className="mt-3 text-zinc-500"># structure</div>
                  <div>src/api/ → 3-file pattern</div>
                  <div>src/components/ui/ → shadcn + Radix</div>
                  <div>src/lib/seo.ts → per-route meta</div>
                  <div className="mt-3 inline-block border-[3px] border-black bg-violet-500 px-2 py-0.5 text-[11px] font-black text-white">
                    + 8 BITS // DARKVEIL / BEAMS / SILK...
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t-[3px] border-black bg-[#F2F0E9] p-3 font-mono text-[11px] font-bold">
                  <div className="border-[3px] border-black bg-white p-2 text-center shadow-[3px_3px_0_#000]">
                    VITE 7 HMR 40ms
                  </div>
                  <div className="border-[3px] border-black bg-black p-2 text-center text-white shadow-[3px_3px_0_#000]">
                    TS 5 STRICT
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[11px] font-black">
                {['AUTH ✓', 'SEO ✓', 'A11Y ✓'].map((t) => (
                  <div
                    key={t}
                    className="border-[3px] border-black bg-white py-2 text-center shadow-[3px_3px_0_#000]"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden border-y-[3px] border-black bg-black text-white">
            <div className="flex w-max animate-[marquee_18s_linear_infinite] whitespace-nowrap font-mono text-xs font-black tracking-[0.18em]">
              {[1, 2].map((k) => (
                <span key={k} className="flex items-center gap-6 px-6 py-2">
                  <span>REACT 19</span> <span className="h-1.5 w-1.5 bg-violet-500" />{' '}
                  <span>TYPESCRIPT</span> <span className="h-1.5 w-1.5 bg-violet-500" />{' '}
                  <span>TAILWIND v4</span> <span className="h-1.5 w-1.5 bg-violet-500" />{' '}
                  <span>VITE 7</span> <span className="h-1.5 w-1.5 bg-violet-500" />{' '}
                  <span>ZUSTAND</span> <span className="h-1.5 w-1.5 bg-violet-500" />{' '}
                  <span>TANSTACK QUERY</span> <span className="h-1.5 w-1.5 bg-violet-500" />{' '}
                  <span>RADIX UI</span> <span className="h-1.5 w-1.5 bg-violet-500" />{' '}
                  <span>GSAP</span> <span className="h-1.5 w-1.5 bg-violet-500" />{' '}
                  <span>AXE-CORE</span> <span className="mx-6">—</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="stack"
          className="mx-auto max-w-[1280px] border-x-[3px] border-t-0 border-black bg-white"
        >
          <div className="grid divide-y-[3px] divide-black border-b-[3px] border-black md:grid-cols-3 md:divide-x-[3px] md:divide-y-0">
            {[
              {
                n: '01',
                t: 'Thin Pages',
                d: 'Pages compose, don’t own. Data via props, never via store hooks inside UI.',
                tag: 'ARCHITECTURE',
              },
              {
                n: '02',
                t: '3-File API',
                d: 'endpoints.ts + hooks.ts + index.ts. One pattern, every domain.',
                tag: 'AXIOS + RQ5',
              },
              {
                n: '03',
                t: 'SEO Ready',
                d: 'Per-route title/meta/OG/canonical via SeoUpdater + siteFiles vite plugin.',
                tag: 'CRAWLABLE',
              },
              {
                n: '04',
                t: 'Perf First',
                d: 'Route split, vendor chunks, WebP 82, eager only LCP. TBT <200ms.',
                tag: 'LCP ≤2.5s',
              },
              {
                n: '05',
                t: 'A11y Enforced',
                d: 'Focus ring, skip-link, axe-core in Vitest. No aXe failures in CI.',
                tag: 'WCAG',
              },
              {
                n: '06',
                t: 'Bits Prewired',
                d: 'DarkVeil / Beams / Silk / Accordion + Home showcase (photo deck, pin).',
                tag: 'REUSABLE',
              },
            ].map((f) => (
              <div key={f.n} className="p-6">
                <div className="flex items-center justify-between">
                  <span className="border-[3px] border-black bg-black px-2 py-0.5 font-mono text-xs font-black text-white">
                    {f.n}
                  </span>
                  <Badge className="rounded-none border-[2px] border-black bg-violet-500 px-2 py-0 font-mono text-[10px] font-black text-white">
                    {f.tag}
                  </Badge>
                </div>
                <h3 className="mt-4 font-mono text-[17px] font-black uppercase tracking-tight">
                  {f.t}
                </h3>
                <p className="mt-2 font-mono text-[12px] leading-5 text-zinc-600">{f.d}</p>
              </div>
            ))}
          </div>

          <div className="grid border-b-[3px] border-black md:grid-cols-[1.1fr_0.9fr]">
            <div className="border-r-0 border-black p-0 md:border-r-[3px]">
              <div className="bg-black px-4 py-2 font-mono text-xs font-black tracking-widest text-white">
                STACK SPEC SHEET
              </div>
              <table className="w-full border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b-[3px] border-black bg-violet-500 text-white">
                    <th className="border-r-[3px] border-black px-3 py-2 text-left">LAYER</th>
                    <th className="px-3 py-2 text-left">CHOICE</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-black">
                  {[
                    ['Framework', 'React 19 + TS 5 (strict)'],
                    ['Bundler', 'Vite 7 + manualChunks'],
                    ['Styling', 'Tailwind v4 + CSS vars'],
                    ['State', 'Zustand (persist) + TanStack Query 5'],
                    ['HTTP', 'Axios + interceptors'],
                    ['Router', 'React Router 7 (lazy)'],
                    ['FX', 'GSAP + OGL + three (on demand)'],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="border-r-[3px] border-black bg-zinc-50 px-3 py-2 font-black">
                        {k}
                      </td>
                      <td className="px-3 py-2">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6">
              <h3 className="font-mono text-sm font-black uppercase tracking-tight">
                Start in 14 seconds
              </h3>
              <div className="mt-3 border-[3px] border-black bg-black p-3 font-mono text-xs leading-5 text-white">
                <div>npm create vite@latest —template react-ts</div>
                <div className="text-violet-500"># or use rapido</div>
                <div>git clone https://github.com/SaifAyman23/react-rapido</div>
                <div>npm run check — typecheck / lint / format / test</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px] font-black">
                <Link
                  to={ROUTES.REGISTER}
                  className="border-[3px] border-black bg-violet-500 py-2 text-center text-white shadow-[3px_3px_0_#000]"
                >
                  CREATE ACCOUNT →
                </Link>
                <a
                  href="https://github.com/SaifAyman23/react-rapido"
                  target="_blank"
                  rel="noreferrer"
                  className="border-[3px] border-black bg-white py-2 text-center shadow-[3px_3px_0_#000]"
                >
                  GITHUB
                </a>
              </div>
              <p className="mt-3 font-mono text-[11px] leading-4 text-zinc-500">
                Keep it lean. CI blocks the build if the bundle gets too big.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] border-x-[3px] border-black bg-violet-500 px-4 py-3 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs font-black">
            <span>BUILT FOR REAL PROJECTS. NOT DEMOS.</span>
            <span className="border-[3px] border-black bg-black px-2 py-1 text-white">
              AGENTS.md
            </span>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-[1280px] border-x-[3px] border-t-0 border-black bg-black px-4 py-6 text-white sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <span className="tracking-widest">© 2026 REACT RAPIDO</span>
          <div className="flex gap-2">
            <span className="border border-white px-2 py-1">RAW</span>
            <span className="border border-white bg-white px-2 py-1 text-black">CLEAN</span>
            <span className="border border-white px-2 py-1">SOLID</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
