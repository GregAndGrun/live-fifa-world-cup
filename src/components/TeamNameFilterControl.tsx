import { SearchIcon } from './icons'

interface TeamNameFilterControlProps {
  id: string
  value: string
  onChange: (value: string) => void
  label: string
}

export function TeamNameFilterControl({
  id,
  value,
  onChange,
  label,
}: TeamNameFilterControlProps) {
  return (
    <div className="team-name-filter">
      <label htmlFor={id}>
        <SearchIcon />
        <span className="sr-only">{label}</span>
      </label>
      <input
        id={id}
        name={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={50}
        autoComplete="off"
        placeholder="Filter by team"
      />
    </div>
  )
}
