import React from 'react';

interface InputProps {
  placeHolder: string;
  type: string;
  value: string;
  className?: string;
  onChange: any;
  name: string;
}

const Input: React.FC<InputProps> = ({
  placeHolder,
  type,
  value,
  onChange,
  name,
  className = '',
}) => {
  return (
    <div className="form-input-container">
      <input
        type={type}
        placeholder={placeHolder}
        name={name}
        value={value}
        className={className}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
