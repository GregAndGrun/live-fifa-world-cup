import type { Match } from '../domain/match'
import {
  createMatch,
  finishMatch,
  ScoreboardError,
  updateMatchScore,
  validateTeamsAreAvailable,
} from '../domain/scoreboard'

export interface ScoreboardState {
  matches: Match[]
  nextMatchNumber: number
  nextStartOrder: number
  feedback: {
    kind: 'success' | 'error'
    message: string
  } | null
}

export type ScoreboardAction =
  | { type: 'start'; homeTeam: string; awayTeam: string }
  | { type: 'update-score'; id: string; homeScore: number; awayScore: number }
  | { type: 'finish'; id: string }

export const initialScoreboardState: ScoreboardState = {
  matches: [],
  nextMatchNumber: 1,
  nextStartOrder: 1,
  feedback: null,
}

function assertNever(value: never): never {
  throw new Error(`Unhandled scoreboard action: ${JSON.stringify(value)}`)
}

function errorMessage(error: unknown): string {
  return error instanceof ScoreboardError
    ? error.message
    : 'Something went wrong. Please try again.'
}

function applyAction(
  state: ScoreboardState,
  action: ScoreboardAction,
): ScoreboardState {
  switch (action.type) {
    case 'start': {
      validateTeamsAreAvailable(state.matches, action.homeTeam, action.awayTeam)
      const match = createMatch({
        id: `match-${state.nextMatchNumber}`,
        homeTeam: action.homeTeam,
        awayTeam: action.awayTeam,
        startedOrder: state.nextStartOrder,
      })

      return {
        ...state,
        matches: [...state.matches, match],
        nextMatchNumber: state.nextMatchNumber + 1,
        nextStartOrder: state.nextStartOrder + 1,
        feedback: {
          kind: 'success',
          message: `${match.homeTeam} vs ${match.awayTeam} is now live.`,
        },
      }
    }

    case 'update-score': {
      const match = state.matches.find((candidate) => candidate.id === action.id)
      if (!match) {
        throw new ScoreboardError('Match not found.')
      }

      const updatedMatch = updateMatchScore(match, action)
      const scoreChanged = updatedMatch !== match

      return {
        ...state,
        matches: state.matches.map((candidate) =>
          candidate.id === action.id ? updatedMatch : candidate,
        ),
        feedback: {
          kind: 'success',
          message: scoreChanged
            ? `Score updated for ${match.homeTeam} vs ${match.awayTeam}.`
            : `The score for ${match.homeTeam} vs ${match.awayTeam} is unchanged.`,
        },
      }
    }

    case 'finish': {
      const match = state.matches.find((candidate) => candidate.id === action.id)
      if (!match) {
        throw new ScoreboardError('Match not found.')
      }

      return {
        ...state,
        matches: state.matches.map((candidate) =>
          candidate.id === action.id ? finishMatch(candidate) : candidate,
        ),
        feedback: {
          kind: 'success',
          message: `${match.homeTeam} vs ${match.awayTeam} has finished.`,
        },
      }
    }

    default:
      return assertNever(action)
  }
}

export function scoreboardReducer(
  state: ScoreboardState,
  action: ScoreboardAction,
): ScoreboardState {
  try {
    return applyAction(state, action)
  } catch (error) {
    return {
      ...state,
      feedback: { kind: 'error', message: errorMessage(error) },
    }
  }
}
