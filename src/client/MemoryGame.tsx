import React, { useState, useEffect, useCallback } from 'react'
import { Card } from './components/Card'
import { Timer } from './components/Timer'
import { CardData, GameState } from '../shared/types/game'

const CARD_REVEAL_DURATION = 1500
const GAME_DURATION = 120000 // 2 minutes
const TIMER_INTERVAL = 100

const EMOJI_PAIRS = [
  '🐶', '🐱', '🐭', '🐹', 
  '🐰', '🦊', '🐻', '🐼'
]

const createGameBoard = (): CardData[] => {
  const cards: CardData[] = []
  let cardId = 0
  
  EMOJI_PAIRS.forEach((emoji, pairIndex) => {
    cards.push({
      id: cardId++,
      emoji,
      state: 'hidden',
      pairId: pairIndex
    })
    
    cards.push({
      id: cardId++,
      emoji,
      state: 'hidden',
      pairId: pairIndex
    })
  })
  
  // Shuffle cards
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  
  return cards
}

export const MemoryGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    cards: createGameBoard(),
    flippedCards: [],
    matchedPairs: [],
    gameStatus: 'playing',
    timeLeft: GAME_DURATION
  }))
  
  const [isPaused, setIsPaused] = useState(false)
  const [canFlip, setCanFlip] = useState(true)

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus !== 'playing' || isPaused) return
    
    const timer = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - TIMER_INTERVAL
        
        if (newTimeLeft <= 0) {
          return {
            ...prev,
            timeLeft: 0,
            gameStatus: 'lost'
          }
        }
        
        return {
          ...prev,
          timeLeft: newTimeLeft
        }
      })
    }, TIMER_INTERVAL)
    
    return () => clearInterval(timer)
  }, [gameState.gameStatus, isPaused])

  // Check for win condition
  useEffect(() => {
    if (gameState.matchedPairs.length === EMOJI_PAIRS.length) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'won'
      }))
    }
  }, [gameState.matchedPairs.length])

  const handleCardClick = useCallback((cardId: number) => {
    if (!canFlip || gameState.gameStatus !== 'playing') return
    
    const card = gameState.cards.find(c => c.id === cardId)
    if (!card || card.state !== 'hidden' || gameState.flippedCards.includes(cardId)) return
    
    if (gameState.flippedCards.length === 2) return
    
    const newFlippedCards = [...gameState.flippedCards, cardId]
    
    setGameState(prev => ({
      ...prev,
      flippedCards: newFlippedCards
    }))
    
    // If two cards are flipped, check for match
    if (newFlippedCards.length === 2) {
      setCanFlip(false)
      
      setTimeout(() => {
        const [firstCardId, secondCardId] = newFlippedCards
        const firstCard = gameState.cards.find(c => c.id === firstCardId)
        const secondCard = gameState.cards.find(c => c.id === secondCardId)
        
        if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
          // Match found
          setGameState(prev => ({
            ...prev,
            cards: prev.cards.map(card => 
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, state: 'matched' }
                : card
            ),
            flippedCards: [],
            matchedPairs: [...prev.matchedPairs, firstCard.emoji]
          }))
        } else {
          // No match
          setGameState(prev => ({
            ...prev,
            flippedCards: []
          }))
        }
        
        setCanFlip(true)
      }, CARD_REVEAL_DURATION)
    }
  }, [gameState, canFlip])

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const resetGame = () => {
    setGameState({
      cards: createGameBoard(),
      flippedCards: [],
      matchedPairs: [],
      gameStatus: 'playing',
      timeLeft: GAME_DURATION
    })
    setIsPaused(false)
    setCanFlip(true)
  }

  const timerProgress = (gameState.timeLeft / GAME_DURATION) * 100

  return (
    <div className="memory-game">
      <Timer progress={timerProgress} isPaused={isPaused} />
      
      <div className="game-container">
        <div className="game-board">
          {gameState.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isFlipped={gameState.flippedCards.includes(card.id)}
              onClick={() => handleCardClick(card.id)}
              disabled={!canFlip || gameState.gameStatus !== 'playing' || card.state === 'matched'}
            />
          ))}
        </div>
        
        {gameState.gameStatus === 'won' && (
          <div className="game-message win">
            🎉 Congratulations! You won! 🎉
            <button onClick={resetGame} className="reset-button">Play Again</button>
          </div>
        )}
        
        {gameState.gameStatus === 'lost' && (
          <div className="game-message lose">
            ⏰ Time's up! Better luck next time!
            <button onClick={resetGame} className="reset-button">Try Again</button>
          </div>
        )}
        
        <button onClick={togglePause} className="pause-button">
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  )
}