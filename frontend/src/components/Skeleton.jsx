import React from 'react';

const Skeleton = ({ className = '', style = {} }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-neutral-800 rounded ${className}`} style={style} />
  );
};

export default Skeleton;
