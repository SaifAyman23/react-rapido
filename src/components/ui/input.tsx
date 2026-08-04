'use client'

import { Upload, FileText, X } from 'lucide-react'
import * as React from 'react'

import { inputVariants, type InputVariants } from './input-variants'

import { cn } from '@/lib/utils'

// ─── Input ────────────────────────────────────────────────────────────────────

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'>, InputVariants {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    // Textarea variant – render <textarea> when variant="textarea"
    if (variant === 'textarea') {
      const { rows, maxLength, ...rest } = props as React.ComponentProps<'textarea'> & InputProps
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={rows ?? 4}
          maxLength={maxLength}
          className={cn(inputVariants({ variant }), className)}
          {...(rest as React.ComponentProps<'textarea'>)}
        />
      )
    }

    return (
      <input
        ref={ref}
        type={type ?? (variant === 'file' ? 'file' : 'text')}
        data-slot="input"
        className={cn(inputVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

// ─── Textarea (convenience re-export) ────────────────────────────────────────

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'> & { className?: string }
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(inputVariants({ variant: 'textarea' }), className)}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

// ─── ImageUpload ──────────────────────────────────────────────────────────────

export interface ImageUploadProps {
  value?: string | null
  onChange?: (dataUrl: string | null) => void
  className?: string
  /** Size of the circular avatar in px (default 112) */
  size?: number
}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ value, onChange, className, size = 112 }, ref) => {
    const internalRef = React.useRef<HTMLInputElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      onChange?.(url)
    }

    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        {/* Circle */}
        <button
          type="button"
          onClick={() => resolvedRef.current?.click()}
          style={{ width: size, height: size }}
          className={cn(
            'relative rounded-full border-2 border-dashed border-primary/30 bg-primary/5',
            'flex flex-col items-center justify-center cursor-pointer',
            'hover:border-primary/60 hover:bg-primary/10 transition-all group overflow-hidden'
          )}
        >
          {value ? (
            <>
              <img src={value} alt="avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-5 h-5 text-white" />
              </div>
            </>
          ) : (
            <Upload className="w-7 h-7 text-primary/40 group-hover:text-primary/70 transition-colors" />
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={resolvedRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />

        <p className="text-xs text-muted-foreground text-center">JPG, PNG or GIF · Max 5&nbsp;MB</p>
      </div>
    )
  }
)
ImageUpload.displayName = 'ImageUpload'

// ─── FileUpload ───────────────────────────────────────────────────────────────

export interface UploadedFile {
  id: number
  name: string
  date: string
}

export interface FileUploadProps {
  files?: UploadedFile[]
  onAdd?: (files: UploadedFile[]) => void
  onRemove?: (id: number) => void
  accept?: string
  multiple?: boolean
  className?: string
}

function FileUpload({
  files = [],
  onAdd,
  onRemove,
  accept = '.pdf,.doc,.docx',
  multiple = true,
  className,
}: FileUploadProps) {
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const mapFiles = (raw: FileList): UploadedFile[] =>
    Array.from(raw).map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      date: `Uploaded on ${new Date().toISOString().slice(0, 10)}`,
    }))

  const handleFiles = (raw: FileList | null) => {
    if (!raw) return
    onAdd?.(mapFiles(raw))
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl py-10',
          'flex flex-col items-center gap-3 cursor-pointer transition-all',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted hover:border-primary/40 hover:bg-primary/5'
        )}
      >
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
            dragging ? 'bg-primary/10' : 'bg-card border border-border'
          )}
        >
          <Upload
            className={cn(
              'w-5 h-5 transition-colors',
              dragging ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {dragging ? 'Drop files here' : 'Browse Files'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Drag & drop or click · {accept.toUpperCase().replace(/\./g, '').replace(/,/g, ', ')}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2.5">
          {files.map((file) => (
            <li
              key={file.id}
              className={cn(
                'flex items-center gap-3',
                'bg-muted border border-border rounded-xl px-4 py-3',
                'group hover:border-primary/20 hover:bg-primary/5 transition-colors'
              )}
            >
              <div className="w-9 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 opacity-70">{file.date}</p>
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(file.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { Input, Textarea, ImageUpload, FileUpload }
export type { InputVariants }
