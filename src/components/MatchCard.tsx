import type { Match } from '../domain/match'
import { useMatchScoreForm } from '../hooks/useMatchScoreForm'
import { BroadcastIcon, FootballIcon, WhistleIcon } from './icons'

interface MatchCardProps {
  match: Match
  onUpdateScore: (id: string, homeScore: number, awayScore: number) => void
  onFinish: (id: string) => void
}

export function MatchCard({
  match,
  onUpdateScore,
  onFinish,
}: MatchCardProps) {
  const {
    homeScore,
    awayScore,
    error,
    setHomeScore,
    setAwayScore,
    handleSubmit,
  } = useMatchScoreForm({
    matchId: match.id,
    initialHomeScore: match.homeScore,
    initialAwayScore: match.awayScore,
    onUpdateScore,
  })

  const titleId = `${match.id}-title`
  const errorId = `${match.id}-score-error`

  return (
    <article className="match-card" aria-labelledby={titleId}>
      <div className="match-content">
        <div className="match-broadcast-bar">
          <span className="live-badge">
            <BroadcastIcon />
            <span className="live-dot" aria-hidden="true" />
            Live
          </span>
          <span className="match-fixture-id">
            <FootballIcon />
            Fixture
          </span>
        </div>

        <div className="match-scoreboard">
          <div className="team-block team-block-home">
            <span className="team-side-label">Home</span>
            <h3
              id={titleId}
              className="team-name"
              aria-label={`${match.homeTeam} versus ${match.awayTeam}`}
            >
              {match.homeTeam}
            </h3>
          </div>

          <div
            className="score-display"
            aria-label={`Score ${match.homeScore} to ${match.awayScore}`}
          >
            <span className="score-digit">{match.homeScore}</span>
            <span className="score-colon" aria-hidden="true">:</span>
            <span className="score-digit">{match.awayScore}</span>
          </div>

          <div className="team-block team-block-away">
            <span className="team-side-label">Away</span>
            <span className="team-name team-name-away" aria-hidden="true">
              {match.awayTeam}
            </span>
            <span className="sr-only"> versus {match.awayTeam}</span>
          </div>
        </div>

        <form className="score-form" onSubmit={handleSubmit}>
          <div className="score-fields">
            <div className="compact-field">
              <label htmlFor={`${match.id}-home-score`}>
                {match.homeTeam} score
              </label>
              <input
                id={`${match.id}-home-score`}
                value={homeScore}
                onChange={(event) => setHomeScore(event.target.value)}
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                aria-describedby={error ? errorId : undefined}
              />
            </div>

            <span className="score-separator" aria-hidden="true">:</span>

            <div className="compact-field">
              <label htmlFor={`${match.id}-away-score`}>
                {match.awayTeam} score
              </label>
              <input
                id={`${match.id}-away-score`}
                value={awayScore}
                onChange={(event) => setAwayScore(event.target.value)}
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                aria-describedby={error ? errorId : undefined}
              />
            </div>
          </div>

          <div className="match-actions">
            <button className="secondary-button" type="submit">
              <FootballIcon />
              Update score
            </button>
            <button
              className="finish-button"
              type="button"
              onClick={() => onFinish(match.id)}
            >
              <WhistleIcon />
              Finish match
            </button>
          </div>
        </form>

        {error && (
          <p id={errorId} className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </article>
  )
}
