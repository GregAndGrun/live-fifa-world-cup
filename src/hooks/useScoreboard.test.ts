import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useScoreboard } from './useScoreboard'

describe('useScoreboard', () => {
  it('starts with an empty board and no feedback', () => {
    const { result } = renderHook(() => useScoreboard())

    expect(result.current.visibleMatches).toEqual([])
    expect(result.current.finishedMatches).toEqual([])
    expect(result.current.liveCount).toBe(0)
    expect(result.current.finishedCount).toBe(0)
    expect(result.current.feedback).toBeNull()
  })

  it('starts a match and exposes it as visible with live success feedback', () => {
    const { result } = renderHook(() => useScoreboard())

    act(() => {
      result.current.startMatch('Mexico', 'Canada')
    })

    expect(result.current.visibleMatches).toMatchObject([
      { homeTeam: 'Mexico', awayTeam: 'Canada', homeScore: 0, awayScore: 0 },
    ])
    expect(result.current.liveCount).toBe(1)
    expect(result.current.feedback).toEqual({
      kind: 'success',
      message: 'Mexico vs Canada is now live.',
    })
  })

  it('records a validation error without adding a match', () => {
    const { result } = renderHook(() => useScoreboard())
    let startResult: ReturnType<typeof result.current.startMatch> | undefined

    act(() => {
      startResult = result.current.startMatch('Brazil', 'brazil')
    })

    expect(startResult).toEqual({
      ok: false,
      message: 'Home and away teams must be different.',
    })
    expect(result.current.visibleMatches).toEqual([])
    expect(result.current.feedback).toEqual({
      kind: 'error',
      message: 'Home and away teams must be different.',
    })
  })

  it('updates the score of a match in progress', () => {
    const { result } = renderHook(() => useScoreboard())

    act(() => {
      result.current.startMatch('Mexico', 'Canada')
    })
    const [started] = result.current.visibleMatches
    if (!started) {
      throw new Error('Expected a started match')
    }

    act(() => {
      result.current.updateScore(started.id, 2, 1)
    })

    expect(result.current.visibleMatches).toMatchObject([
      { homeScore: 2, awayScore: 1 },
    ])
  })

  it('moves a match from visible to finished', () => {
    const { result } = renderHook(() => useScoreboard())

    act(() => {
      result.current.startMatch('Mexico', 'Canada')
    })
    const [started] = result.current.visibleMatches
    if (!started) {
      throw new Error('Expected a started match')
    }

    act(() => {
      result.current.finish(started.id)
    })

    expect(result.current.visibleMatches).toEqual([])
    expect(result.current.liveCount).toBe(0)
    expect(result.current.finishedMatches).toMatchObject([
      { homeTeam: 'Mexico', awayTeam: 'Canada' },
    ])
    expect(result.current.finishedCount).toBe(1)
  })

  it('filters live and finished matches by team name without changing totals', () => {
    const { result } = renderHook(() => useScoreboard())

    act(() => {
      result.current.startMatch('Mexico', 'Canada')
      result.current.startMatch('Spain', 'Brazil')
    })

    const mexico = result.current.visibleMatches.find(
      (match) => match.homeTeam === 'Mexico',
    )
    if (!mexico) {
      throw new Error('Expected Mexico vs Canada')
    }

    act(() => {
      result.current.finish(mexico.id)
    })

    act(() => {
      result.current.setTeamNameFilter('mex')
    })

    expect(result.current.liveCount).toBe(1)
    expect(result.current.finishedCount).toBe(1)
    expect(result.current.visibleMatches).toEqual([])
    expect(result.current.finishedMatches).toMatchObject([
      { homeTeam: 'Mexico', awayTeam: 'Canada' },
    ])
  })

  it('orders visible matches by total goals then most recent start', () => {
    const { result } = renderHook(() => useScoreboard())

    act(() => {
      result.current.startMatch('Mexico', 'Canada')
      result.current.startMatch('Spain', 'Brazil')
    })

    const [mexico, spain] = result.current.visibleMatches
    if (!mexico || !spain) {
      throw new Error('Expected two started matches')
    }

    act(() => {
      result.current.updateScore(mexico.id, 1, 1)
      result.current.updateScore(spain.id, 1, 1)
    })

    expect(result.current.visibleMatches.map((match) => match.homeTeam)).toEqual([
      'Spain',
      'Mexico',
    ])
  })
})
