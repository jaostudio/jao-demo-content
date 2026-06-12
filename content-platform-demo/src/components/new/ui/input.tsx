import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input ${error ? 'border-danger focus:border-danger focus:shadow-[0_0_0_2px_rgba(220,38,38,0.15)]' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] text-danger">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
