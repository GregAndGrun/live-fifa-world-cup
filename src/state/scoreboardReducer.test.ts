import { describe, expect, it } from 'vitest'
import {
  initialScoreboardState,
  scoreboardReducer,
  type ScoreboardState,
} from './scoreboardReducer'

function start(
  state: ScoreboardState,
  homeTeam: string,
  awayTeam: string,
): ScoreboardState {
  return scoreboardReducer(state, { type: 'start', homeTeam, awayTeam })
}

describe('scoreboardReducer', () => {
  it('starts a match with an incrementing id and start order', () => {
    let state = start(initialScoreboardState, 'Mexico', 'Canada')
    state = start(state, 'Spain', 'Brazil')

    expect(state.matches).toMatchObject([
      { id: 'match-1', homeTeam: 'Mexico', awayTeam: 'Canada', startedOrder: 1 },
      { id: 'match-2', homeTeam: 'Spain', awayTeam: 'Brazil', startedOrder: 2 },
    ])
    expect(state.feedback).toEqual({
      kind: 'success',
      message: 'Spain vs Brazil is now live.',
    })
  })

  it('records a validation error without starting a match', () => {
    const state = start(initialScoreboardState, 'Brazil', 'brazil')

    expect(state.matches).toHaveLength(0)
    expect(state.feedback).toEqual({
      kind: 'error',
      message: 'Home and away teams must be different.',
    })
  })

  it('updates a match score in place', () => {
    let state = start(initialScoreboardState, 'Mexico', 'Canada')
    state = scoreboardReducer(state, {
      type: 'update-score',
      id: 'match-1',
      homeScore: 1,
      awayScore: 0,
    })

    expect(state.matches[0]).toMatchObject({ homeScore: 1, awayScore: 0 })
    expect(state.feedback).toEqual({
      kind: 'success',
      message: 'Score updated for Mexico vs Canada.',
    })
  })

  it('marks a match as finished', () => {
    let state = start(initialScoreboardState, 'Mexico', 'Canada')
    state = scoreboardReducer(state, { type: 'finish', id: 'match-1' })

    expect(state.matches[0]).toMatchObject({ status: 'finished' })
    expect(state.feedback).toEqual({
      kind: 'success',
      message: 'Mexico vs Canada has finished.',
    })
  })

  it('clears feedback on request', () => {
    let state = start(initialScoreboardState, 'Mexico', 'Canada')
    state = scoreboardReducer(state, { type: 'clear-feedback' })

    expect(state.feedback).toBeNull()
  })
})
