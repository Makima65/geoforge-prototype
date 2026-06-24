import React, { useState, useEffect } from 'react';
import './MarkCompleteCard.css';

const MarkCompleteCard = ({ isCompleted, onToggle }) => {
  const [status, setStatus] = useState(isCompleted ? 'completed' : 'idle');

  useEffect(() => {
    setStatus(isCompleted ? 'completed' : 'idle');
  }, [isCompleted]);

  const handleClick = () => {
    if (status === 'idle') {
      setStatus('confirming');
    } else if (status === 'confirming') {
      onToggle(true);
      setStatus('completed');
    } else if (status === 'completed') {
      onToggle(false);
      setStatus('idle');
    }
  };

  let text = 'Mark Build Completed';
  let arrowColor = '#5de2a3';
  if (status === 'confirming') {
    text = 'Click again to confirm!';
    arrowColor = '#3ecf8e';
  } else if (status === 'completed') {
    text = 'Build Completed - Click to Undo';
    arrowColor = '#cfcfcf';
  }

  return (
    <div className={`mc-container ${status === 'animating' ? 'is-animating' : ''} ${status === 'completed' ? 'is-completed' : ''}`} onClick={handleClick}>
      <div className="mc-left-side">
        <div className="mc-card">
          <div className="mc-card-line" />
          <div className="mc-buttons" />
        </div>
        <div className="mc-post">
          <div className="mc-post-line" />
          <div className="mc-screen">
            <div className="mc-dollar">✓</div>
          </div>
          <div className="mc-numbers" />
          <div className="mc-numbers-line2" />
        </div>
      </div>
      <div className="mc-right-side">
        <div className="mc-new" style={{ color: status === 'confirming' ? '#3ecf8e' : 'white' }}>{text}</div>
        <svg viewBox="0 0 451.846 451.847" xmlns="http://www.w3.org/2000/svg" className="mc-arrow">
          <path fill={arrowColor} d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z" />
        </svg>
      </div>
    </div>
  );
}

export default MarkCompleteCard;
