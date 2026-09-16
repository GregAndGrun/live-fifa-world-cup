export type MatchStatus = 'in-progress' | 'finished'

export interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status: MatchStatus
  startedOrder: number
}

export interface NewMatchInput {
  id: string
  homeTeam: string
  awayTeam: string
  startedOrder: number
}

export interface ScoreInput {
  homeScore: number
  awayScore: number
}
