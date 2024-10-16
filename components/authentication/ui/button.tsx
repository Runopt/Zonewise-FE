import React from 'react';
interface ButtonProps {
  value: string;
  id: string;
  type: any

}
const Button: React.FC<ButtonProps> = ({ value, id, type }) => {
  return (
    <div className='form-button-container'>
      <button type={type} id={id}>{value}</button>
    </div>
  );
};

export default Button;
