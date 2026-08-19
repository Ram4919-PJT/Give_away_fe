export default function KycFormField({
  field,
  value,
  onChange,
  error,
  disabled,
  className = '',
}) {
  const id = `kyc-field-${field.key}`;
  const hasError = Boolean(error);

  return (
    <div
      className={`kyc-form-field${field.half ? ' kyc-form-field--half' : ''}${hasError ? ' kyc-form-field--error' : ''} ${className}`.trim()}
    >
      <label className="kyc-form-field__label" htmlFor={id}>
        {field.label}
        {field.required ? <span className="kyc-form-field__req" aria-hidden="true">*</span> : null}
      </label>
      {field.hint && <p className="kyc-form-field__hint">{field.hint}</p>}

      {field.type === 'select' ? (
        <select
          id={id}
          className="kyc-form-field__control"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
        >
          <option value="">Select…</option>
          {(field.options || []).map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          id={id}
          className="kyc-form-field__control"
          rows={4}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          className="kyc-form-field__control"
          type={field.type || (field.sensitive && field.key !== 'id_number' ? 'password' : 'text')}
          value={field.sensitive && !value ? '' : (value ?? '')}
          placeholder={field.placeholder || ''}
          max={field.type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
          maxLength={field.maxLength}
          inputMode={field.inputMode}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
        />
      )}

      {field.sensitive && value && field.maskPreview && (
        <p className="kyc-form-field__secure">{field.maskPreview}</p>
      )}

      {hasError && (
        <p id={`${id}-error`} className="kyc-form-field__error" role="alert">{error}</p>
      )}
    </div>
  );
}
