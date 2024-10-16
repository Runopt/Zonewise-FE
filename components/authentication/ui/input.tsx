import React from 'react';
interface InputProps {
  placeHolder: string;
  type: string;
  value: string;
//   onChange(e: any): any;
  name: string;
}
const Input: React.FC<InputProps> = ({
  placeHolder,
  type,
  value,
  name,
}) => {

    
  return (
    <div className="form-input-container">
      <input
        type={type}
        placeholder={placeHolder}
        // value=
        name={name}
      />
    </div>
  );
};

export default Input;
