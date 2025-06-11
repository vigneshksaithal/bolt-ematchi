import React from 'react'
import { CardData } from '../../shared/types/game'

interface CardProps {
  card: CardData
  isFlipped: boolean
  onClick: () => void
  disabled: boolean
}

export const Card: React.FC<CardProps> = ({ card, isFlipped, onClick, disabled }) => {
  // Only show emoji when flipped and not matched
  const showEmoji = isFlipped && card.state !== 'matched'
  
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''} ${card.state === 'matched' ? 'matched' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={!disabled && card.state !== 'matched' ? onClick : undefined}
    >
      <div className="card-inner">
        <div className="card-front">
          {showEmoji && <span className="emoji">{card.emoji}</span>}
        </div>
      </div>
    </div>
  )
}