import { describe, expect, it } from 'vitest'
import type { Match } from './match'
import {
  createMatch,
  finishMatch,
  getFinishedMatches,
  getMatchesInProgress,
  ScoreboardError,
  updateMatchScore,
  validateTeamsAreAvailable,
} from './scoreboard'

function match(
  id: string,
  homeTeam: string,
  awayTeam: string,
  startedOrder: number,
  homeScore = 0,
  awayScore = 0,
): Match {
  return {
    ...createMatch({ id, homeTeam, awayTeam, startedOrder }),
    homeScore,
    awayScore,
  }
}

describe('scoreboard domain', () => {
  it('orders the exercise scenario by total goals then recent start', () => {
    const matches = [
      match('1', 'Mexico', 'Canada', 1, 0, 5),
      match('2', 'Spain', 'Brazil', 2, 10, 2),
      match('3', 'Germany', 'France', 3, 2, 2),
      match('4', 'Uruguay', 'Italy', 4, 6, 6),
      match('5', 'Argentina', 'Australia', 5, 3, 1),
    ]

    expect(getMatchesInProgress(matches).map(({ homeTeam }) => homeTeam)).toEqual([
      'Uruguay',
      'Spain',
      'Mexico',
      'Argentina',
      'Germany',
    ])
  })

  it('uses most recently started first when total goals are tied', () => {
    const older = match('older', 'Japan', 'Korea', 4, 1, 1)
    const newer = match('newer', 'USA', 'Ghana', 5, 2, 0)

    expect(getMatchesInProgress([older, newer])).toEqual([newer, older])
  })

  it('excludes finished matches without mutating the source collection', () => {
    const live = match('live', 'Poland', 'Senegal', 1, 1, 0)
    const finished = finishMatch(match('finished', 'Peru', 'Denmark', 2, 1, 1))
    const source = [live, finished]

    expect(getMatchesInProgress(source)).toEqual([live])
    expect(source).toEqual([live, finished])
  })

  it('returns a new match when updating and leaves the original unchanged', () => {
    const original = match('1', 'Mexico', 'Canada', 1)

    const updated = updateMatchScore(original, { homeScore: 2, awayScore: 3 })

    expect(updated).toMatchObject({ homeScore: 2, awayScore: 3 })
    expect(original).toMatchObject({ homeScore: 0, awayScore: 0 })
  })

  it('returns the same match when the score is unchanged', () => {
    const original = match('1', 'Mexico', 'Canada', 1, 1, 2)

    const updated = updateMatchScore(original, { homeScore: 1, awayScore: 2 })

    expect(updated).toBe(original)
  })

  it('normalizes names and rejects invalid match data', () => {
    expect(
      createMatch({
        id: '1',
        homeTeam: '  Costa   Rica ',
        awayTeam: ' Germany ',
        startedOrder: 1,
      }),
    ).toMatchObject({ homeTeam: 'Costa Rica', awayTeam: 'Germany' })

    expect(() =>
      createMatch({
        id: '2',
        homeTeam: 'Brazil',
        awayTeam: ' brazil ',
        startedOrder: 2,
      }),
    ).toThrow(ScoreboardError)
    expect(() =>
      updateMatchScore(match('3', 'France', 'Spain', 3), {
        homeScore: -1,
        awayScore: 0,
      }),
    ).toThrow('Scores must be non-negative whole numbers.')
  })

  it('prevents a team from joining two simultaneous matches', () => {
    const matches = [match('1', 'Mexico', 'Canada', 1)]

    expect(() =>
      validateTeamsAreAvailable(matches, 'Argentina', 'mexico'),
    ).toThrow('Mexico already has a match in progress.')
  })

  it('rejects updates to a finished match', () => {
    const finished = finishMatch(match('1', 'Mexico', 'Canada', 1))

    expect(() =>
      updateMatchScore(finished, { homeScore: 1, awayScore: 0 }),
    ).toThrow('A finished match cannot be updated.')
  })

  it('lists finished matches with the most recently started first', () => {
    const live = match('live', 'Poland', 'Senegal', 3, 1, 0)
    const olderFinished = finishMatch(match('older', 'Peru', 'Denmark', 1, 1, 1))
    const newerFinished = finishMatch(match('newer', 'Japan', 'Spain', 2, 2, 0))
    const source = [live, olderFinished, newerFinished]

    expect(getFinishedMatches(source)).toEqual([newerFinished, olderFinished])
  })
})
