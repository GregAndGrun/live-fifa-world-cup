import type { Match } from '../domain/match'
import { FlagPennantIcon, TrophyIcon, WhistleIcon } from './icons'

interface FinishedMatchesTableProps {
  matches: readonly Match[]
}

export function FinishedMatchesTable({ matches }: FinishedMatchesTableProps) {
  return (
    <section className="finished-section" aria-labelledby="finished-title">
      <div className="section-heading">
        <p className="eyebrow">
          <WhistleIcon />
          Full time
        </p>
        <h2 id="finished-title">Finished matches</h2>
      </div>

      {matches.length > 0 ? (
        <div className="finished-table-wrapper">
          <table className="finished-table">
            <caption className="sr-only">
              Finished matches with their final score
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <FlagPennantIcon />
                  Home
                </th>
                <th scope="col" className="finished-table-score-col">
                  <TrophyIcon />
                  Final score
                </th>
                <th scope="col" className="finished-table-away-col">
                  <FlagPennantIcon />
                  Away
                </th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id}>
                  <td>
                    <span className="finished-team">
                      <span className="finished-team-dot" aria-hidden="true" />
                      {match.homeTeam}
                    </span>
                  </td>
                  <td className="finished-table-score-col">
                    <span
                      className="finished-score"
                      aria-label={`Final score ${match.homeScore} to ${match.awayScore}`}
                    >
                      {match.homeScore}
                      <span aria-hidden="true">:</span>
                      {match.awayScore}
                    </span>
                    <span className="ft-badge" aria-hidden="true">FT</span>
                  </td>
                  <td className="finished-table-away-col">
                    <span className="finished-team finished-team-away">
                      <span className="finished-team-dot finished-team-dot-away" aria-hidden="true" />
                      {match.awayTeam}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="finished-empty">
          <WhistleIcon />
          No matches have finished yet.
        </p>
      )}
    </section>
  )
}
