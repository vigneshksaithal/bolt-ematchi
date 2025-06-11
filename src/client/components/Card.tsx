import React from 'react'
import { CardData } from '../../shared/types/game'

interface CardProps {
  card: CardData
  isFlipped: boolean
  onClick: () => void
  disabled: boolean
}

export const Card: React.FC<CardProps> = ({ card, isFlipped, onClick, disabled }) => {
  const showEmoji = isFlipped || card.state === 'matched'
  
  return (
    <div
      className={`card ${showEmoji ? 'flipped' : ''} ${card.state === 'matched' ? 'matched' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="card-inner">
        <div className="card-front">
          {showEmoji && <span className="emoji">{card.emoji}</span>}
        </div>
      </div>
    </div>
  )
}