import { useState } from 'react'
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
import type { StartMatchResult } from './useStartMatchForm'

export type { StartMatchResult }

export interface UseScoreboardResult {
  feedback: ScoreboardState['feedback']
  liveTeamNameFilter: string
  setLiveTeamNameFilter: (value: string) => void
  finishedTeamNameFilter: string
  setFinishedTeamNameFilter: (value: string) => void
  visibleMatches: Match[]
  finishedMatches: Match[]
  liveCount: number
  finishedCount: number
  startMatch: (homeTeam: string, awayTeam: string) => StartMatchResult
  updateScore: (id: string, homeScore: number, awayScore: number) => void
  finish: (id: string) => void
}

export function useScoreboard(): UseScoreboardResult {
  const [state, setState] = useState(initialScoreboardState)
  const [liveTeamNameFilter, setLiveTeamNameFilter] = useState('')
  const [finishedTeamNameFilter, setFinishedTeamNameFilter] = useState('')

  const liveMatches = getMatchesInProgress(state.matches)
  const completedMatches = getFinishedMatches(state.matches)
  const visibleMatches = filterMatchesByTeamName(liveMatches, liveTeamNameFilter)
  const finishedMatches = filterMatchesByTeamName(
    completedMatches,
    finishedTeamNameFilter,
  )

  function startMatch(homeTeam: string, awayTeam: string): StartMatchResult {
    let result: StartMatchResult = { ok: true }

    setState((previous) => {
      const next = scoreboardReducer(previous, {
        type: 'start',
        homeTeam,
        awayTeam,
      })

      result =
        next.feedback?.kind === 'error'
          ? { ok: false, message: next.feedback.message }
          : { ok: true }

      return next
    })

    return result
  }

  function updateScore(id: string, homeScore: number, awayScore: number) {
    setState((previous) =>
      scoreboardReducer(previous, {
        type: 'update-score',
        id,
        homeScore,
        awayScore,
      }),
    )
  }

  function finish(id: string) {
    setState((previous) => scoreboardReducer(previous, { type: 'finish', id }))
  }

  return {
    feedback: state.feedback,
    liveTeamNameFilter,
    setLiveTeamNameFilter,
    finishedTeamNameFilter,
    setFinishedTeamNameFilter,
    visibleMatches,
    finishedMatches,
    liveCount: liveMatches.length,
    finishedCount: completedMatches.length,
    startMatch,
    updateScore,
    finish,
  }
}
