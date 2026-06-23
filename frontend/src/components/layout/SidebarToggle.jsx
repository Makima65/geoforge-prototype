import React from 'react';
import './SidebarToggle.css';

const SidebarToggle = ({ isOpen, toggle }) => {
  return (
    <div className="sidebar-toggle-wrapper flex shrink-0">
      <input 
        type="checkbox" 
        id="sidebar-checkbox" 
        checked={!isOpen} 
        onChange={toggle} 
      />
      <label htmlFor="sidebar-checkbox" className="toggle mb-0">
        <div className="bars" id="bar1" />
        <div className="bars" id="bar2" />
        <div className="bars" id="bar3" />
      </label>
    </div>
  );
}

export default SidebarToggle;
