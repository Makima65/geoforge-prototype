import React from 'react';
import './AnimatedCheckbox.css';

const AnimatedCheckbox = ({ id, label, checked, onChange }) => {
  return (
    <div className="animated-checklist-container">
      <input 
        type="checkbox" 
        id={id} 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
      />
      <label htmlFor={id} className="text-[15px] font-medium tracking-tight">
        {label}
      </label>
    </div>
  );
};

export default AnimatedCheckbox;
