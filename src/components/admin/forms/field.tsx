import * as React from "react"
import { cn } from "@/lib/utils"

// ── Field wrapper ──

export const FormFieldSet = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1.5", className)} {...props} />
))
FormFieldSet.displayName = "FormFieldSet"

export const FormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props} />
))
FormField.displayName = "FormField"

// ── Label ──

interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-neutral-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
)
FieldLabel.displayName = "FieldLabel"

// ── Description ──

export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-neutral-400 leading-relaxed", className)}
    {...props}
  />
))
FieldDescription.displayName = "FieldDescription"

// ── Error ──

interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string | null | false
}

export const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, message, ...props }, ref) => {
    if (!message) return null
    return (
      <p
        ref={ref}
        role="alert"
        className={cn("text-xs font-medium text-red-500 flex items-center gap-1", className)}
        {...props}
      >
        <svg
          className="w-3.5 h-3.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        {message}
      </p>
    )
  }
)
FieldError.displayName = "FieldError"
