import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { runAxe, summarizeViolations } from '@/test/axe'

function scan(ui: React.ReactNode) {
  const { container } = render(ui)
  return runAxe(container).then((results) => {
    expect(results.violations, summarizeViolations(results)).toEqual([])
  })
}

describe('a11y scans', () => {
  it('Button has no aXe violations', async () => {
    await scan(<Button>Get started</Button>)
  })

  it('Labelled Input has no aXe violations', async () => {
    await scan(
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </div>
    )
  })
})
