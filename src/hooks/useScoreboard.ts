import { useCallback, useMemo, useReducer } from 'react'
import type { Match } from '../domain/match'
import { getFinishedMatches, getMatchesInProgress } from '../domain/scoreboard'
import {
  initialScoreboardState,
  scoreboardReducer,
  type ScoreboardState,
} from '../state/scoreboardReducer'

export interface UseScoreboardResult {
  matches: Match[]
  feedback: ScoreboardState['feedback']
  visibleMatches: Match[]
  finishedMatches: Match[]
  liveCount: number
  finishedCount: number
  startMatch: (homeTeam: string, awayTeam: string) => void
  updateScore: (id: string, homeScore: number, awayScore: number) => void
  finish: (id: string) => void
}

export function useScoreboard(): UseScoreboardResult {
  const [state, dispatch] = useReducer(
    scoreboardReducer,
    initialScoreboardState,
  )

  const visibleMatches = useMemo(
    () => getMatchesInProgress(state.matches),
    [state.matches],
  )

  const finishedMatches = useMemo(
    () => getFinishedMatches(state.matches),
    [state.matches],
  )

  const startMatch = useCallback(
    (homeTeam: string, awayTeam: string) =>
      dispatch({ type: 'start', homeTeam, awayTeam }),
    [],
  )

  const updateScore = useCallback(
    (id: string, homeScore: number, awayScore: number) =>
      dispatch({ type: 'update-score', id, homeScore, awayScore }),
    [],
  )

  const finish = useCallback(
    (id: string) => dispatch({ type: 'finish', id }),
    [],
  )

  return {
    matches: state.matches,
    feedback: state.feedback,
    visibleMatches,
    finishedMatches,
    liveCount: visibleMatches.length,
    finishedCount: finishedMatches.length,
    startMatch,
    updateScore,
    finish,
  }
}
