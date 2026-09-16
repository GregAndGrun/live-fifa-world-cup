import { act, renderHook } from '@testing-library/react'
import type { FormEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Match } from '../domain/match'
import { createMatch } from '../domain/scoreboard'
import { useStartMatchForm } from './useStartMatchForm'

function existingMatch(id: string, homeTeam: string, awayTeam: string): Match {
  return createMatch({ id, homeTeam, awayTeam, startedOrder: 1 })
}

function submit(): FormEvent<HTMLFormElement> {
  return { preventDefault: () => {} } as FormEvent<HTMLFormElement>
}

describe('useStartMatchForm', () => {
  it('starts empty with no error', () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useStartMatchForm([], onStart))

    expect(result.current.homeTeam).toBe('')
    expect(result.current.awayTeam).toBe('')
    expect(result.current.error).toBe('')
  })

  it('calls onStart and clears the fields on a valid submit', () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useStartMatchForm([], onStart))

    act(() => {
      result.current.setHomeTeam('Mexico')
      result.current.setAwayTeam('Canada')
    })
    act(() => {
      result.current.handleSubmit(submit())
    })

    expect(onStart).toHaveBeenCalledWith('Mexico', 'Canada')
    expect(result.current.homeTeam).toBe('')
    expect(result.current.awayTeam).toBe('')
    expect(result.current.error).toBe('')
  })

  it('sets an error and does not call onStart for identical team names', () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useStartMatchForm([], onStart))

    act(() => {
      result.current.setHomeTeam('Brazil')
      result.current.setAwayTeam('brazil')
    })
    act(() => {
      result.current.handleSubmit(submit())
    })

    expect(onStart).not.toHaveBeenCalled()
    expect(result.current.error).toBe('Home and away teams must be different.')
  })

  it('sets an error when a team already has a match in progress', () => {
    const onStart = vi.fn()
    const matches = [existingMatch('match-1', 'Mexico', 'Canada')]
    const { result } = renderHook(() => useStartMatchForm(matches, onStart))

    act(() => {
      result.current.setHomeTeam('Mexico')
      result.current.setAwayTeam('Spain')
    })
    act(() => {
      result.current.handleSubmit(submit())
    })

    expect(onStart).not.toHaveBeenCalled()
    expect(result.current.error).toBe('Mexico already has a match in progress.')
  })

  it('clears a previous error as soon as a field changes', () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useStartMatchForm([], onStart))

    act(() => {
      result.current.setHomeTeam('Brazil')
      result.current.setAwayTeam('brazil')
    })
    act(() => {
      result.current.handleSubmit(submit())
    })
    expect(result.current.error).not.toBe('')

    act(() => {
      result.current.setAwayTeam('Argentina')
    })

    expect(result.current.error).toBe('')
  })
})
