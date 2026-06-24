import React from 'react';
import './Skeleton.css';

const Skeleton = ({ className = '', style = {} }) => {
  return (
    <div className={`skeleton-shimmer ${className}`} style={style} />
  );
};

export default Skeleton;
