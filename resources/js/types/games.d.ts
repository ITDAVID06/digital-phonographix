export type Letter = {
  id: string
  letter: string
  originalIndex: number
}

export type WordData = {
  word: string
  letters: Letter[]
  imagePlaceholder?: string
}

export type Story = {
  sentences: string[]
  images: string[]
}

export type AuditoryProcessingData = {
  letters: string[]
  correctWords: string[]
}

export type BingoCard = {
  grid: string[][]
}

export type SoundBingoData = {
  cards: BingoCard[]
}

/** NEW: Redirect config for chaining games */
export type GameRedirectConfig = {
  categoryName: string   // e.g. "Reading Stories"
  gameName: string       // e.g. "Fat Cat Story"
}

export type GameData = {
  name: string
  words?: WordData[]
  story?: Story
  isStory?: boolean
  auditoryProcessing?: AuditoryProcessingData
  soundBingo?: SoundBingoData
  wordList?: string[]
  gameType?: "wordBuilding" | "story" | "auditoryProcessing" | "soundBingo" | "wordList"

  /** NEW: where to go after finishing this game */
  redirectTo?: GameRedirectConfig
}

export type GameCategory = {
  name: string
  games: GameData[]
}
