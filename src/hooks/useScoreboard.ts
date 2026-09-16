import { useCallback, useMemo, useReducer, useState } from 'react'
import type { Match } from '../domain/match'
import {
  filterMatchesByTeamName,
  getFinishedMatches,
  getMatchesInProgress,
} from '../domain/scoreboard'
import {
  initialScoreboardState,
  scoreboardReducer,
  type ScoreboardState,
} from '../state/scoreboardReducer'

export interface UseScoreboardResult {
  matches: Match[]
  feedback: ScoreboardState['feedback']
  teamNameFilter: string
  setTeamNameFilter: (value: string) => void
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
  const [teamNameFilter, setTeamNameFilter] = useState('')

  const liveMatches = useMemo(
    () => getMatchesInProgress(state.matches),
    [state.matches],
  )

  const completedMatches = useMemo(
    () => getFinishedMatches(state.matches),
    [state.matches],
  )

  const visibleMatches = useMemo(
    () => filterMatchesByTeamName(liveMatches, teamNameFilter),
    [liveMatches, teamNameFilter],
  )

  const finishedMatches = useMemo(
    () => filterMatchesByTeamName(completedMatches, teamNameFilter),
    [completedMatches, teamNameFilter],
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
    teamNameFilter,
    setTeamNameFilter,
    visibleMatches,
    finishedMatches,
    liveCount: liveMatches.length,
    finishedCount: completedMatches.length,
    startMatch,
    updateScore,
    finish,
  }
}
