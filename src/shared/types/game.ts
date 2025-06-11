export type CardState = 'hidden' | 'revealed' | 'matched'

export interface CardData {
  id: number
  emoji: string
  state: CardState
  pairId: number
}

export interface GameState {
  cards: CardData[]
  flippedCards: number[]
  matchedPairs: string[]
  gameStatus: 'playing' | 'won' | 'lost'
  timeLeft: number
}