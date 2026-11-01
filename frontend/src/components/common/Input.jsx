const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  register,
  error,
  step,
  min,
  max,
}) => {
  return (
    <div className="common-input-group">
      <label className="common-input-label" htmlFor={name}>
        {label}
      </label>

      <input
        className={`common-input ${error ? "input-error" : ""}`}
        id={name}
        type={type}
        step={step}
        min={min}
        max={max}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...register(name)}
      />

      {error && (
        <p className="common-input-error" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
