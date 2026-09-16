import { useState, type FormEvent } from 'react'

export type StartMatchResult =
  | { ok: true }
  | { ok: false; message: string }

export function useStartMatchForm(
  onStart: (homeTeam: string, awayTeam: string) => StartMatchResult,
) {
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = onStart(homeTeam, awayTeam)
    if (result.ok) {
      setHomeTeam('')
      setAwayTeam('')
    }
  }

  return {
    homeTeam,
    awayTeam,
    setHomeTeam,
    setAwayTeam,
    handleSubmit,
  }
}
