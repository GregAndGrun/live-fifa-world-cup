import type { Match } from '../domain/match'
import { BroadcastIcon, StadiumIcon } from './icons'
import { MatchCard } from './MatchCard'
import { TeamNameFilterControl } from './TeamNameFilterControl'

interface MatchSummaryProps {
  matches: readonly Match[]
  teamNameFilter: string
  onTeamNameFilterChange: (value: string) => void
  onUpdateScore: (id: string, homeScore: number, awayScore: number) => void
  onFinish: (id: string) => void
}

export function MatchSummary({
  matches,
  teamNameFilter,
  onTeamNameFilterChange,
  onUpdateScore,
  onFinish,
}: MatchSummaryProps) {
  const isFiltering = teamNameFilter.trim().length > 0

  return (
    <section className="summary-section" aria-labelledby="summary-title">
      <div className="summary-toolbar">
        <div className="section-heading">
          <p className="eyebrow">
            <BroadcastIcon />
            On air
          </p>
          <h2 id="summary-title">Matches in progress</h2>
        </div>

        <TeamNameFilterControl
          id="live-team-name-filter"
          value={teamNameFilter}
          onChange={onTeamNameFilterChange}
          label="Filter live matches by team name"
        />
      </div>

      {matches.length > 0 ? (
        <div className="match-list" aria-live="polite">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onUpdateScore={onUpdateScore}
              onFinish={onFinish}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            <StadiumIcon />
          </div>
          {isFiltering ? (
            <>
              <h3>No live matches for that team</h3>
              <p>Try another name, or clear the filter to see the full board.</p>
            </>
          ) : (
            <>
              <h3>No live matches yet</h3>
              <p>Start a match above to add it to the live board.</p>
            </>
          )}
        </div>
      )}
    </section>
  )
}
