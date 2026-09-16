import { act, renderHook } from '@testing-library/react'
import type { FormEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useStartMatchForm } from './useStartMatchForm'

function submit(): FormEvent<HTMLFormElement> {
  return { preventDefault: () => {} } as FormEvent<HTMLFormElement>
}

describe('useStartMatchForm', () => {
  it('starts empty', () => {
    const onStart = vi.fn(() => ({ ok: true as const }))
    const { result } = renderHook(() => useStartMatchForm(onStart))

    expect(result.current.homeTeam).toBe('')
    expect(result.current.awayTeam).toBe('')
  })

  it('calls onStart and clears the fields when start succeeds', () => {
    const onStart = vi.fn(() => ({ ok: true as const }))
    const { result } = renderHook(() => useStartMatchForm(onStart))

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
  })

  it('keeps the fields when start fails', () => {
    const onStart = vi.fn(() => ({
      ok: false as const,
      message: 'Home and away teams must be different.',
    }))
    const { result } = renderHook(() => useStartMatchForm(onStart))

    act(() => {
      result.current.setHomeTeam('Brazil')
      result.current.setAwayTeam('brazil')
    })
    act(() => {
      result.current.handleSubmit(submit())
    })

    expect(onStart).toHaveBeenCalledWith('Brazil', 'brazil')
    expect(result.current.homeTeam).toBe('Brazil')
    expect(result.current.awayTeam).toBe('brazil')
  })
})
