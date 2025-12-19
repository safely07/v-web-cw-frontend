export const FormField = ({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  disabled,
  error,
  required = false
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}) => (
  <div className="w-full max-w-[340px]">
    <label className="block text-base font-medium text-gray-300 mb-3">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-[var(--input-background)] border ${error ? 'border-red-500' : 'border-gray-600'} rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      disabled={disabled}
      required={required}
    />
    {error && (
      <p className="text-red-400 text-sm mt-2">{error}</p>
    )}
  </div>
);