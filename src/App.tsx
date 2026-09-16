import { FinishedMatchesTable } from './components/FinishedMatchesTable'
import {
  BroadcastIcon,
  FootballIcon,
  StadiumIcon,
  TrophyIcon,
} from './components/icons'
import { MatchSummary } from './components/MatchSummary'
import { StartMatchForm } from './components/StartMatchForm'
import { useScoreboard } from './hooks/useScoreboard'

export default function App() {
  const {
    matches,
    feedback,
    teamNameFilter,
    setTeamNameFilter,
    visibleMatches,
    finishedMatches,
    liveCount,
    finishedCount,
    startMatch,
    updateScore,
    finish,
  } = useScoreboard()

  return (
    <div className="app-shell">
      <div className="pitch-texture" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#main-content" aria-label="World Cup Live home">
          <span className="brand-emblem" aria-hidden="true">
            <TrophyIcon />
          </span>
          <span className="brand-text">
            <strong>World Cup</strong>
            <small>Live Centre</small>
          </span>
        </a>

        <div className="header-ticker" aria-hidden="true">
          <span>
            <StadiumIcon />
            Matchday control
          </span>
          <span>
            <FootballIcon />
            32 nations
          </span>
          <span>
            <BroadcastIcon />
            Live updates
          </span>
        </div>

        <div className="header-status">
          <span className="live-dot" aria-hidden="true" />
          On air
        </div>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-pitch-lines" aria-hidden="true" />
          <div className="hero-spotlight" aria-hidden="true" />

          <div className="hero-inner">
            <div className="hero-copy">
              <div className="wc-badge">
                <TrophyIcon />
                <span>FIFA World Cup</span>
              </div>

              <h1 id="page-title">
                The world&apos;s game,
                <span>one scoreboard.</span>
              </h1>

              <p className="hero-description">
                Kick off matches, track every goal, and watch the live ranking
                shift as the tournament unfolds.
              </p>

              <div className="hero-stats">
                <div className="hero-stat">
                  <strong>{liveCount}</strong>
                  <span>Live now</span>
                </div>
                <div className="hero-stat">
                  <strong>{finishedCount}</strong>
                  <span>Full time</span>
                </div>
                <div className="hero-stat">
                  <strong>0–0</strong>
                  <span>Kickoff</span>
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-emblem">
                <TrophyIcon />
              </div>
              <div className="hero-arc hero-arc-1" />
              <div className="hero-arc hero-arc-2" />
            </div>
          </div>
        </section>

        <div className="content-grid">
          <StartMatchForm matches={matches} onStart={startMatch} />

          {feedback && (
            <p
              className={`feedback feedback-${feedback.kind}`}
              role={feedback.kind === 'error' ? 'alert' : 'status'}
            >
              {feedback.message}
            </p>
          )}

          <MatchSummary
            matches={visibleMatches}
            teamNameFilter={teamNameFilter}
            onTeamNameFilterChange={setTeamNameFilter}
            onUpdateScore={updateScore}
            onFinish={finish}
          />

          <FinishedMatchesTable
            matches={finishedMatches}
            teamNameFilter={teamNameFilter}
            onTeamNameFilterChange={setTeamNameFilter}
          />
        </div>
      </main>

      <footer>
        <p>
          <TrophyIcon />
          Built for the beautiful game.
        </p>
        <p>
          <BroadcastIcon />
          Scores update in this browser session.
        </p>
      </footer>
    </div>
  )
}
