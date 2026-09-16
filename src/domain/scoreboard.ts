import type { Match, NewMatchInput, ScoreInput } from './match'

export class ScoreboardError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ScoreboardError'
  }
}

export function normalizeTeamName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

function comparableTeamName(name: string): string {
  return normalizeTeamName(name).toLocaleLowerCase()
}

export function validateTeams(homeTeam: string, awayTeam: string): void {
  const normalizedHome = normalizeTeamName(homeTeam)
  const normalizedAway = normalizeTeamName(awayTeam)

  if (!normalizedHome || !normalizedAway) {
    throw new ScoreboardError('Enter both home and away team names.')
  }

  if (normalizedHome.length > 50 || normalizedAway.length > 50) {
    throw new ScoreboardError('Team names must be 50 characters or fewer.')
  }

  if (comparableTeamName(normalizedHome) === comparableTeamName(normalizedAway)) {
    throw new ScoreboardError('Home and away teams must be different.')
  }
}

export function validateTeamsAreAvailable(
  matches: readonly Match[],
  homeTeam: string,
  awayTeam: string,
): void {
  validateTeams(homeTeam, awayTeam)

  const requestedTeams = new Set([
    comparableTeamName(homeTeam),
    comparableTeamName(awayTeam),
  ])
  const unavailableTeam = matches
    .filter((match) => match.status === 'in-progress')
    .flatMap((match) => [match.homeTeam, match.awayTeam])
    .find((team) => requestedTeams.has(comparableTeamName(team)))

  if (unavailableTeam) {
    throw new ScoreboardError(`${unavailableTeam} already has a match in progress.`)
  }
}

export function createMatch(input: NewMatchInput): Match {
  validateTeams(input.homeTeam, input.awayTeam)

  if (!input.id || !Number.isSafeInteger(input.startedOrder) || input.startedOrder < 1) {
    throw new ScoreboardError('A match requires a valid identity and start order.')
  }

  return {
    id: input.id,
    homeTeam: normalizeTeamName(input.homeTeam),
    awayTeam: normalizeTeamName(input.awayTeam),
    homeScore: 0,
    awayScore: 0,
    status: 'in-progress',
    startedOrder: input.startedOrder,
  }
}

function validateScore(score: number): void {
  if (!Number.isSafeInteger(score) || score < 0) {
    throw new ScoreboardError('Scores must be non-negative whole numbers.')
  }
}

export function updateMatchScore(match: Match, score: ScoreInput): Match {
  if (match.status !== 'in-progress') {
    throw new ScoreboardError('A finished match cannot be updated.')
  }

  validateScore(score.homeScore)
  validateScore(score.awayScore)

  if (
    match.homeScore === score.homeScore &&
    match.awayScore === score.awayScore
  ) {
    return match
  }

  return {
    ...match,
    homeScore: score.homeScore,
    awayScore: score.awayScore,
  }
}

export function finishMatch(match: Match): Match {
  if (match.status !== 'in-progress') {
    throw new ScoreboardError('This match is already finished.')
  }

  return { ...match, status: 'finished' }
}

export function totalGoals(match: Match): number {
  return match.homeScore + match.awayScore
}

export function getMatchesInProgress(matches: readonly Match[]): Match[] {
  return matches
    .filter((match) => match.status === 'in-progress')
    .sort(
      (first, second) =>
        totalGoals(second) - totalGoals(first) ||
        second.startedOrder - first.startedOrder,
    )
}

export function getFinishedMatches(matches: readonly Match[]): Match[] {
  return matches
    .filter((match) => match.status === 'finished')
    .sort((first, second) => second.startedOrder - first.startedOrder)
}

export function matchIncludesTeamName(match: Match, teamNameQuery: string): boolean {
  const query = comparableTeamName(teamNameQuery)
  if (!query) {
    return true
  }

  return (
    comparableTeamName(match.homeTeam).includes(query) ||
    comparableTeamName(match.awayTeam).includes(query)
  )
}

export function filterMatchesByTeamName(
  matches: readonly Match[],
  teamNameQuery: string,
): Match[] {
  return matches.filter((match) => matchIncludesTeamName(match, teamNameQuery))
}
