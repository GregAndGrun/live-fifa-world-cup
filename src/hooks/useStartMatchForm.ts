import { useState, type FormEvent } from 'react'
import type { Match } from '../domain/match'
import {
  ScoreboardError,
  validateTeamsAreAvailable,
} from '../domain/scoreboard'

export function useStartMatchForm(
  matches: readonly Match[],
  onStart: (homeTeam: string, awayTeam: string) => void,
) {
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      validateTeamsAreAvailable(matches, homeTeam, awayTeam)
      onStart(homeTeam, awayTeam)
      setHomeTeam('')
      setAwayTeam('')
      setError('')
    } catch (caughtError) {
      setError(
        caughtError instanceof ScoreboardError
          ? caughtError.message
          : 'Unable to start this match.',
      )
    }
  }

  return {
    homeTeam,
    awayTeam,
    error,
    setHomeTeam: (value: string) => {
      setHomeTeam(value)
      setError('')
    },
    setAwayTeam: (value: string) => {
      setAwayTeam(value)
      setError('')
    },
    handleSubmit,
  }
}
