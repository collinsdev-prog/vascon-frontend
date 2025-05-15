import React from 'react';

const Input = ({ 
  type = 'text', 
  id, 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  label = '',
  error = '',
  className = '',
  required = false,
  disabled = false,
  ...props 
}) => {
  return (
    <div className={`input-wrapper ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
        required={required}
        disabled={disabled}
        {...props}
      />
      {error && <p className="input-error">{error}</p>}
    </div>
  );
};

export default Input;