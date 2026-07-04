"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { FormFieldSet, FormField, FieldLabel, FieldDescription, FieldError } from "./field"

const SelectContext = React.createContext<{ value: string; onValueChange: (v: string) => void } | null>(null)

interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  description?: React.ReactNode
  error?: string | null
  required?: boolean
  placeholder?: string
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  description,
  error,
  required,
  placeholder,
}: SelectFieldProps) {
  const fieldId = label.toLowerCase().replace(/\s+/g, "-")
  const [open, setOpen] = React.useState(false)

  const selectedLabel = options.find(o => o.value === value)?.label ?? value

  return (
    <FormFieldSet>
      <FormField>
        <FieldLabel htmlFor={fieldId} required={required}>
          {label}
        </FieldLabel>
        <input id={fieldId} value={value} onChange={() => {}} className="hidden" />
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm",
              "transition-colors hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-ring/20",
              open && "border-primary ring-2 ring-ring/20",
              error && "border-destructive"
            )}
          >
            <span className={cn(!value && "text-muted-foreground")}>{selectedLabel || placeholder || "Pilih..."}</span>
            <ChevronDownIcon className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute left-0 right-0 top-full z-50 mt-1">
                <div className="rounded-lg border border-border bg-popover p-1 shadow-lg">
                  {placeholder && value === "" && (
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm text-muted-foreground rounded-md hover:bg-muted"
                      onClick={() => { onChange(""); setOpen(false) }}
                    >
                      {placeholder}
                    </button>
                  )}
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { onChange(opt.value); setOpen(false) }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                        value === opt.value
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {value === opt.value && (
                        <span className="mr-1.5 inline-flex size-4 items-center justify-center">✓</span>
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        {description && <FieldDescription>{description}</FieldDescription>}
        <FieldError message={error} />
      </FormField>
    </FormFieldSet>
  )
}
