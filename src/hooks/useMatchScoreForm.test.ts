import { act, renderHook } from '@testing-library/react'
import type { FormEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useMatchScoreForm } from './useMatchScoreForm'

function submit(): FormEvent<HTMLFormElement> {
  return { preventDefault: () => {} } as FormEvent<HTMLFormElement>
}

describe('useMatchScoreForm', () => {
  it('initializes fields from the given scores', () => {
    const onUpdateScore = vi.fn()
    const { result } = renderHook(() =>
      useMatchScoreForm({
        matchId: 'match-1',
        initialHomeScore: 1,
        initialAwayScore: 2,
        onUpdateScore,
      }),
    )

    expect(result.current.homeScore).toBe('1')
    expect(result.current.awayScore).toBe('2')
    expect(result.current.error).toBe('')
  })

  it('calls onUpdateScore with parsed integers on a valid submit', () => {
    const onUpdateScore = vi.fn()
    const { result } = renderHook(() =>
      useMatchScoreForm({
        matchId: 'match-1',
        initialHomeScore: 0,
        initialAwayScore: 0,
        onUpdateScore,
      }),
    )

    act(() => {
      result.current.setHomeScore('3')
      result.current.setAwayScore('1')
    })
    act(() => {
      result.current.handleSubmit(submit())
    })

    expect(onUpdateScore).toHaveBeenCalledWith('match-1', 3, 1)
    expect(result.current.error).toBe('')
  })

  it('rejects non-numeric input without calling onUpdateScore', () => {
    const onUpdateScore = vi.fn()
    const { result } = renderHook(() =>
      useMatchScoreForm({
        matchId: 'match-1',
        initialHomeScore: 0,
        initialAwayScore: 0,
        onUpdateScore,
      }),
    )

    act(() => {
      result.current.setHomeScore('abc')
      result.current.setAwayScore('1')
    })
    act(() => {
      result.current.handleSubmit(submit())
    })

    expect(onUpdateScore).not.toHaveBeenCalled()
    expect(result.current.error).toBe(
      'Enter non-negative whole numbers for both scores.',
    )
  })

  it('rejects negative numbers without calling onUpdateScore', () => {
    const onUpdateScore = vi.fn()
    const { result } = renderHook(() =>
      useMatchScoreForm({
        matchId: 'match-1',
        initialHomeScore: 0,
        initialAwayScore: 0,
        onUpdateScore,
      }),
    )

    act(() => {
      result.current.setHomeScore('-1')
    })
    act(() => {
      result.current.handleSubmit(submit())
    })

    expect(onUpdateScore).not.toHaveBeenCalled()
    expect(result.current.error).not.toBe('')
  })

  it('clears a previous error as soon as a field changes', () => {
    const onUpdateScore = vi.fn()
    const { result } = renderHook(() =>
      useMatchScoreForm({
        matchId: 'match-1',
        initialHomeScore: 0,
        initialAwayScore: 0,
        onUpdateScore,
      }),
    )

    act(() => {
      result.current.setHomeScore('abc')
    })
    act(() => {
      result.current.handleSubmit(submit())
    })
    expect(result.current.error).not.toBe('')

    act(() => {
      result.current.setHomeScore('1')
    })

    expect(result.current.error).toBe('')
  })
})
