import React from 'react';

export const OptionButton = ({ nikud, onClick, disabled, status }) => {
  // status can be 'idle', 'correct', 'incorrect', 'highlight'
  let statusClass = 'option-btn-idle';
  
  if (status === 'correct') {
    statusClass = 'option-btn-correct';
  } else if (status === 'incorrect') {
    statusClass = 'option-btn-incorrect';
  } else if (status === 'highlight') {
    statusClass = 'option-btn-highlight';
  }

  return (
    <button
      onClick={() => onClick(nikud)}
      disabled={disabled}
      className={`option-btn ${statusClass} ${disabled && status === 'idle' ? 'option-btn-disabled' : ''}`}
    >
      {nikud.symbol}
    </button>
  );
};
