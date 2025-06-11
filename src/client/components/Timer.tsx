import React from 'react'

interface TimerProps {
  progress: number
  isPaused: boolean
}

export const Timer: React.FC<TimerProps> = ({ progress, isPaused }) => {
  return (
    <div className="timer-container">
      <div className={`timer-button ${isPaused ? 'paused' : 'playing'}`}>
        <div className="timer-icon">
          {isPaused ? '▶' : '⏸'}
        </div>
      </div>
      <div className="timer-bar">
        <div 
          className="timer-progress" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}