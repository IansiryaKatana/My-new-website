/** Vite/TanStack Start options when a Portfolio demo is hosted under /demos/{slug}/ on iankatana.com */

export function isHostedDemoBuild() {
  return Boolean(process.env.DEMO_BASE_PATH)
}

export function getHostedViteBuildConfig() {
  return isHostedDemoBuild() ? { emptyOutDir: false } : undefined
}

export function getHostedDemoSlug() {
  const match = process.env.DEMO_BASE_PATH?.match(/\/demos\/([^/]+)/)
  return match?.[1] ?? 'demo'
}

export function getHostedDemoBuildRoot() {
  return `.hosted-build/${getHostedDemoSlug()}`
}

/** Alternate build output when dist/ is locked by a running dev server. */
export function getHostedDemoDefineExtras(): Record<string, unknown> {
  if (!isHostedDemoBuild()) return {}

  const buildRoot = getHostedDemoBuildRoot()

  return {
    build: {
      emptyOutDir: true,
      outDir: buildRoot,
    },
    environments: {
      client: {
        build: {
          outDir: `${buildRoot}/client`,
          emptyOutDir: true,
        },
      },
      ssr: {
        build: {
          outDir: `${buildRoot}/server`,
          emptyOutDir: true,
        },
      },
    },
  }
}

export function getPortfolioDemoViteConfig() {
  const hostedBase = process.env.DEMO_BASE_PATH
  const isHosted = isHostedDemoBuild()
  const base = hostedBase
    ? hostedBase.endsWith('/')
      ? hostedBase
      : `${hostedBase}/`
    : '/'
  const basepath = base === '/' ? '/' : base.replace(/\/$/, '')

  return {
    base,
    basepath,
    static: isHosted ? true : undefined,
    prerender: isHosted
      ? {
          enabled: true,
          crawlLinks: false,
        }
      : undefined,
  }
}

export function getDemoDevPort(fallback: number) {
  return Number(process.env.DEMO_DEV_PORT ?? fallback)
}

export function getTanstackStartDemoPluginOptions(
  existing: Record<string, unknown> = {},
) {
  const demo = getPortfolioDemoViteConfig()
  const existingRouter =
    typeof existing.router === 'object' && existing.router !== null
      ? (existing.router as Record<string, unknown>)
      : {}

  return {
    ...existing,
    router: {
      ...existingRouter,
      basepath: demo.basepath,
    },
    ...(demo.static ? { static: demo.static } : {}),
    ...(demo.prerender ? { prerender: demo.prerender } : {}),
  }
}
