import React from 'react';

interface InputProps {
  placeHolder: string;
  type: string;
  value: string;
  defaultValue: string;
  onChange: any;
  name: string;
}

const Input: React.FC<InputProps> = ({
  placeHolder,
  type,
  value,
  onChange,
  name,
  defaultValue,
}) => {
  return (
    <div className="form-input-container">
      <input
        type={type}
        placeholder={placeHolder}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
