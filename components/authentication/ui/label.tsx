import React from 'react';
interface LabelProps {
  value: string;
}
const Label: React.FC<LabelProps> = ({ value }) => {
  return (
    <div className='form-label'>
      <label>{value}</label>
    </div>
  );
};

export default Label;
