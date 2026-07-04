"use client"

import * as React from "react"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { FormFieldSet, FormField, FieldLabel, FieldDescription, FieldError } from "./field"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface DatePickerFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: React.ReactNode
  error?: string | null
  required?: boolean
  placeholder?: string
}

export function DatePickerField({
  label,
  value,
  onChange,
  description,
  error,
  required,
  placeholder,
}: DatePickerFieldProps) {
  const fieldId = label.toLowerCase().replace(/\s+/g, "-")
  const [open, setOpen] = React.useState(false)

  const displayValue = value ? format(new Date(value), "dd MMMM yyyy", { locale: id }) : placeholder || "Pilih tanggal"

  return (
    <FormFieldSet>
      <FormField>
        <FieldLabel htmlFor={fieldId} required={required}>
          {label}
        </FieldLabel>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            id={fieldId}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm",
              "transition-colors hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-ring/20",
              error && "border-destructive",
              !value && "text-muted-foreground"
            )}
          >
            <span className="truncate flex items-center gap-2">
              <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
              {displayValue}
            </span>
            <ChevronDownIcon className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
          </PopoverTrigger>

          <PopoverContent className="w-auto p-2" sideOffset={5} align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={date => {
                if (date) {
                  onChange(format(date, "yyyy-MM-dd"))
                  setOpen(false)
                }
              }}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>

        {description && <FieldDescription>{description}</FieldDescription>}
        <FieldError message={error} />
      </FormField>
    </FormFieldSet>
  )
}