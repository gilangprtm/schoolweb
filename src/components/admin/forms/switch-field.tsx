import * as React from "react"
import { FormFieldSet, FormField, FieldLabel, FieldDescription, FieldError } from "./field"

interface SwitchFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  error?: string | null
  /** Text shown when checked */
  onLabel?: string
  /** Text shown when unchecked */
  offLabel?: string
}

export function SwitchField({
  label,
  checked,
  onChange,
  description,
  error,
  onLabel = "Aktif",
  offLabel = "Nonaktif",
}: SwitchFieldProps) {
  const fieldId = label.toLowerCase().replace(/\s+/g, "-")

  return (
    <FormFieldSet>
      <FormField className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <FieldLabel htmlFor={fieldId}>
            {label}
          </FieldLabel>
          {description && <FieldDescription>{description}</FieldDescription>}
        </div>
        <button
          id={fieldId}
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
            ${checked ? "bg-emerald-500" : "bg-neutral-300"}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0
              transition-transform duration-200 ease-in-out
              ${checked ? "translate-x-5" : "translate-x-0"}
            `}
          />
        </button>
      </FormField>
      <FieldError message={error} />
      <p className="text-xs text-neutral-500 text-right -mt-1">{checked ? onLabel : offLabel}</p>
    </FormFieldSet>
  )
}
