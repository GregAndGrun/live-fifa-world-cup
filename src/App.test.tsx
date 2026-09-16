import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

async function startMatch(
  user: ReturnType<typeof userEvent.setup>,
  homeTeam: string,
  awayTeam: string,
) {
  await user.type(screen.getByLabelText('Home team'), homeTeam)
  await user.type(screen.getByLabelText('Away team'), awayTeam)
  await user.click(screen.getByRole('button', { name: 'Start match' }))
}

async function updateScore(
  user: ReturnType<typeof userEvent.setup>,
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
) {
  const match = screen
    .getByRole('heading', {
      name: new RegExp(`${homeTeam} versus ${awayTeam}`, 'i'),
    })
    .closest('article')

  if (!match) {
    throw new Error('Expected match card')
  }

  const card = within(match)
  await user.clear(card.getByLabelText(`${homeTeam} score`))
  await user.type(card.getByLabelText(`${homeTeam} score`), String(homeScore))
  await user.clear(card.getByLabelText(`${awayTeam} score`))
  await user.type(card.getByLabelText(`${awayTeam} score`), String(awayScore))
  await user.click(card.getByRole('button', { name: 'Update score' }))
}

describe('App', () => {
  it('starts, updates, and finishes a match', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('No live matches yet')).toBeInTheDocument()
    expect(screen.getByText('No matches have finished yet.')).toBeInTheDocument()

    await startMatch(user, 'Mexico', 'Canada')
    expect(
      screen.getByRole('heading', { name: /Mexico versus Canada/i }),
    ).toBeInTheDocument()

    await updateScore(user, 'Mexico', 'Canada', 1, 2)
    expect(screen.getByLabelText('Score 1 to 2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Finish match' }))

    expect(
      screen.queryByRole('heading', { name: /Mexico versus Canada/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('No live matches yet')).toBeInTheDocument()

    const finishedTable = screen.getByRole('table')
    expect(within(finishedTable).getByText('Mexico')).toBeInTheDocument()
    expect(within(finishedTable).getByText('Canada')).toBeInTheDocument()
    expect(
      within(finishedTable).getByLabelText('Final score 1 to 2'),
    ).toBeInTheDocument()
  })

  it('validates teams and keeps invalid matches off the board', async () => {
    const user = userEvent.setup()
    render(<App />)

    await startMatch(user, 'Brazil', ' brazil ')

    expect(
      screen.getByText('Home and away teams must be different.'),
    ).toBeInTheDocument()
    expect(screen.queryAllByRole('article')).toHaveLength(0)
  })

  it('orders several in-progress matches by total goals then most recent start', async () => {
    const user = userEvent.setup()
    render(<App />)

    await startMatch(user, 'Mexico', 'Canada')
    await startMatch(user, 'Spain', 'Brazil')
    await startMatch(user, 'Germany', 'France')
    await updateScore(user, 'Mexico', 'Canada', 2, 0)
    await updateScore(user, 'Spain', 'Brazil', 3, 2)
    await updateScore(user, 'Germany', 'France', 1, 1)

    const cards = screen.getAllByRole('article')
    expect(cards[0]).toHaveTextContent('Spain')
    expect(cards[1]).toHaveTextContent('Germany')
    expect(cards[2]).toHaveTextContent('Mexico')
  })

  it('filters live and finished matches by team name', async () => {
    const user = userEvent.setup()
    render(<App />)

    await startMatch(user, 'Mexico', 'Canada')
    await startMatch(user, 'Spain', 'Brazil')
    await updateScore(user, 'Mexico', 'Canada', 1, 0)

    const mexicoCard = screen
      .getByRole('heading', { name: /Mexico versus Canada/i })
      .closest('article')
    if (!mexicoCard) {
      throw new Error('Expected Mexico vs Canada card')
    }
    await user.click(
      within(mexicoCard).getByRole('button', { name: 'Finish match' }),
    )

    const liveFilter = screen.getByRole('searchbox', {
      name: 'Filter live matches by team name',
    })
    const finishedFilter = screen.getByRole('searchbox', {
      name: 'Filter finished matches by team name',
    })
    expect(liveFilter).toBeInTheDocument()
    expect(finishedFilter).toBeInTheDocument()

    await user.type(liveFilter, 'spain')

    expect(
      screen.getByRole('heading', { name: /Spain versus Brazil/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Mexico versus Canada/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('No finished matches for that team.')).toBeInTheDocument()
    expect(finishedFilter).toHaveValue('spain')

    await user.clear(finishedFilter)
    await user.type(finishedFilter, 'mexico')

    expect(screen.getByText('No live matches for that team')).toBeInTheDocument()
    expect(liveFilter).toHaveValue('mexico')
    const finishedTable = screen.getByRole('table')
    expect(within(finishedTable).getByText('Mexico')).toBeInTheDocument()
  })
})
