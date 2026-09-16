import type { Match } from '../domain/match'
import { BroadcastIcon, StadiumIcon } from './icons'
import { MatchCard } from './MatchCard'

interface MatchSummaryProps {
  matches: readonly Match[]
  onUpdateScore: (id: string, homeScore: number, awayScore: number) => void
  onFinish: (id: string) => void
}

export function MatchSummary({
  matches,
  onUpdateScore,
  onFinish,
}: MatchSummaryProps) {
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

        <div className="summary-meta" aria-hidden="true">
          <StadiumIcon />
          <span>{matches.length} live</span>
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="match-list" aria-live="polite">
          {matches.map((match, index) => (
            <MatchCard
              key={match.id}
              match={match}
              position={index + 1}
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
          <h3>No live matches yet</h3>
          <p>Start a match above to add it to the live board.</p>
        </div>
      )}
    </section>
  )
}
