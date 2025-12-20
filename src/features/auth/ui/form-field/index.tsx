
export const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  disabled = false, 
  error = "", 
  required = false, 
  className = "", 
  containerClassName = "" 
}: { 
  label: string; 
  type?: string; 
  value: string; 
  onChange: (value: string) => void; 
  placeholder: string; 
  disabled?: boolean; 
  error?: string; 
  required?: boolean; 
  className?: string; 
  containerClassName?: string; 
}) => (
  <div className={`flex flex-col gap-[var(--element-spacing)] ${containerClassName}`}>
    {/* Метка с индикатором обязательного поля */}
    <label 
      className="text-[var(--text-primary)] text-[var(--font-size-sm)] font-medium"
    >
      {label}
      {required && <span className="text-[var(--error)] ml-1">*</span>}
    </label>

    {/* Поле ввода */}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full
        px-3
        h-[var(--input-height)]
        bg-[var(--input-background)]
        text-[var(--input-foreground)]
        border border-[var(--input-border)]
        rounded-[var(--border-radius)]
        placeholder:text-[var(--input-placeholder)]
        font-[var(--font-ui)]
        text-[var(--font-size-md)]
        transition-all duration-[var(--transition)]
        focus:outline-none
        focus:border-[var(--input-focus-border)]
        focus:shadow-[var(--input-focus-shadow)]
        disabled:bg-[var(--button-disabled)]
        disabled:text-[var(--text-muted)]
        disabled:cursor-not-allowed
        hover:border-[var(--input-focus-border)]
        ${error ? 'border-[var(--error)] focus:border-[var(--error)]' : ''}
        ${className}
      `}
    />

    {/* Сообщение об ошибке */}
    {error && (
      <div className="flex items-center gap-2 text-[var(--error)] text-[var(--font-size-xs)]">
        <span className="text-lg">⚠</span>
        <span>{error}</span>
      </div>
    )}
  </div>
);
