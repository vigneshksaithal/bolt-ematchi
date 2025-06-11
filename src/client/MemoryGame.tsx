import React, { useState, useEffect, useCallback } from 'react'
import { Card } from './components/Card'
import { Timer } from './components/Timer'
import { CardData, GameState } from '../shared/types/game'

// Global variable for card reveal duration (in milliseconds)
const CARD_REVEAL_DURATION = 1500
const GAME_DURATION = 120000 // 2 minutes in milliseconds
const TIMER_INTERVAL = 100 // Update timer every 100ms

// Emoji pairs for the game (8 unique pairs for 16 cards)
const EMOJI_PAIRS = [
  '🐶', '🐱', '🐭', '🐹', 
  '🐰', '🦊', '🐻', '🐼'
]

const createGameBoard = (): CardData[] => {
  const cards: CardData[] = []
  let cardId = 0
  
  // Create pairs of cards
  EMOJI_PAIRS.forEach((emoji, pairIndex) => {
    // Add first card of the pair
    cards.push({
      id: cardId++,
      emoji,
      state: 'hidden',
      pairId: pairIndex
    })
    
    // Add second card of the pair
    cards.push({
      id: cardId++,
      emoji,
      state: 'hidden',
      pairId: pairIndex
    })
  })
  
  // Shuffle the cards using Fisher-Yates algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = cards[i]
    cards[i] = cards[j]
    cards[j] = temp
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
          // Match found - cards become disabled and emojis disappear
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
          // No match, flip cards back
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
        
        <div className="matched-emojis">
          {gameState.matchedPairs.map((emoji, index) => (
            <span key={index} className="matched-emoji">{emoji}</span>
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