import { cva, type VariantProps } from 'class-variance-authority'

export const inputVariants = cva(
  [
    'w-full rounded-xl border border-border bg-muted',
    'text-sm text-foreground placeholder:text-muted-foreground',
    'transition-all outline-none',
    'focus:border-primary focus:ring-2 focus:ring-primary/15',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
  ],
  {
    variants: {
      variant: {
        default: 'px-4 py-2.5 h-10 shadow-xs',
        textarea: 'px-4 py-3 resize-none',
        file: [
          'file:mr-3 file:py-1 file:px-3',
          'file:rounded-lg file:border-0',
          'file:bg-primary/10 file:text-primary file:text-xs file:font-medium',
          'file:cursor-pointer file:transition-colors',
          'hover:file:bg-primary/20',
          'px-3 py-2 h-10 cursor-pointer',
        ].join(' '),
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export type InputVariants = VariantProps<typeof inputVariants>
