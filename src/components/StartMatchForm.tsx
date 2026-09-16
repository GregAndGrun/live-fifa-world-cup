import type { StartMatchResult } from '../hooks/useStartMatchForm'
import { useStartMatchForm } from '../hooks/useStartMatchForm'
import { FootballIcon, KickoffIcon, TeamShieldIcon } from './icons'

interface StartMatchFormProps {
  onStart: (homeTeam: string, awayTeam: string) => StartMatchResult
}

export function StartMatchForm({ onStart }: StartMatchFormProps) {
  const {
    homeTeam,
    awayTeam,
    setHomeTeam,
    setAwayTeam,
    handleSubmit,
  } = useStartMatchForm(onStart)

  return (
    <section className="start-panel" aria-labelledby="start-match-title">
      <div className="panel-accent" aria-hidden="true">
        <KickoffIcon />
      </div>

      <div className="section-heading">
        <p className="eyebrow">
          <FootballIcon />
          Kickoff desk
        </p>
        <h2 id="start-match-title">Start a new match</h2>
      </div>

      <form className="start-form" onSubmit={handleSubmit} noValidate>
        <div className="field team-field team-field-home">
          <label htmlFor="home-team">
            <TeamShieldIcon />
            Home team
          </label>
          <input
            id="home-team"
            name="homeTeam"
            value={homeTeam}
            onChange={(event) => setHomeTeam(event.target.value)}
            maxLength={50}
            autoComplete="off"
            placeholder="e.g. Mexico"
          />
        </div>

        <span className="versus" aria-hidden="true">vs</span>

        <div className="field team-field team-field-away">
          <label htmlFor="away-team">
            <TeamShieldIcon />
            Away team
          </label>
          <input
            id="away-team"
            name="awayTeam"
            value={awayTeam}
            onChange={(event) => setAwayTeam(event.target.value)}
            maxLength={50}
            autoComplete="off"
            placeholder="e.g. Canada"
          />
        </div>

        <button className="primary-button" type="submit">
          <KickoffIcon />
          Start match
        </button>
      </form>
    </section>
  )
}
