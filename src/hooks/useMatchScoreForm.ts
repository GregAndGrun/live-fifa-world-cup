import { useEffect, useState, type FormEvent } from 'react'

function parseScore(value: string): number | null {
  if (!/^\d+$/.test(value)) {
    return null
  }

  const score = Number(value)
  return Number.isSafeInteger(score) ? score : null
}

export interface UseMatchScoreFormOptions {
  matchId: string
  initialHomeScore: number
  initialAwayScore: number
  onUpdateScore: (id: string, homeScore: number, awayScore: number) => void
}

export function useMatchScoreForm({
  matchId,
  initialHomeScore,
  initialAwayScore,
  onUpdateScore,
}: UseMatchScoreFormOptions) {
  const [homeScore, setHomeScore] = useState(String(initialHomeScore))
  const [awayScore, setAwayScore] = useState(String(initialAwayScore))
  const [error, setError] = useState('')

  useEffect(() => {
    setHomeScore(String(initialHomeScore))
    setAwayScore(String(initialAwayScore))
    setError('')
  }, [matchId, initialHomeScore, initialAwayScore])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsedHomeScore = parseScore(homeScore)
    const parsedAwayScore = parseScore(awayScore)

    if (parsedHomeScore === null || parsedAwayScore === null) {
      setError('Enter non-negative whole numbers for both scores.')
      return
    }

    onUpdateScore(matchId, parsedHomeScore, parsedAwayScore)
    setError('')
  }

  return {
    homeScore,
    awayScore,
    error,
    setHomeScore: (value: string) => {
      setHomeScore(value)
      setError('')
    },
    setAwayScore: (value: string) => {
      setAwayScore(value)
      setError('')
    },
    handleSubmit,
  }
}
