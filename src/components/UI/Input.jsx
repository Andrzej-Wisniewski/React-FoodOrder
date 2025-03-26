import { useId } from 'react';

export default function Input({ label, id, name, type, autoComplete, required, ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const inputName = name || inputId;

  const getAutoComplete = () => {
    if (autoComplete) return autoComplete;
    if (type === 'email') return 'email';
    if (type === 'password') return 'current-password';
    return 'off';
  };

  return (
    <p className="control">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        name={inputName}
        type={type}
        autoComplete={getAutoComplete()}
        required={required}
        {...props}
      />
    </p>
  );
}