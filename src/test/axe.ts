import axe from 'axe-core'

export async function runAxe(container: HTMLElement): Promise<axe.AxeResults> {
  return axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      'link-in-text-block': { enabled: false },
      region: { enabled: false },
    },
  })
}

export function summarizeViolations(results: axe.AxeResults): string {
  return results.violations
    .map((v) => `${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})`)
    .join('\n')
}
