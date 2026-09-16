interface IconProps {
  className?: string
}

export function TrophyIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 3.5h8l.5 1.2c.2.5.2 1-.1 1.4l-.9 1.1h-6.9l-.9-1.1c-.3-.4-.3-.9-.1-1.4L8 3.5Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M8.2 4h7.6v5.2c0 3.4-1.7 5.8-3.8 5.8S8.2 12.6 8.2 9.2V4Z"
        fill="currentColor"
      />
      <path
        d="M8.2 4.8H6.2c0 2.2.6 4.1 2 5.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M15.8 4.8h2c0 2.2-.6 4.1-2 5.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M10.5 15h3v2.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M9 17.2h6v1.6c0 .6-.5 1.2-1.2 1.2h-3.6c-.7 0-1.2-.6-1.2-1.2v-1.6Z"
        fill="currentColor"
      />
      <path
        d="M8.2 19.8h7.6v1.2c0 .5-.4.8-.9.8h-5.8c-.5 0-.9-.3-.9-.8v-1.2Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M10.8 7.2h2.4l.3 1.8h-3l.3-1.8Z"
        fill="currentColor"
        opacity="0.25"
      />
    </svg>
  )
}

export function FootballIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M12 5.2 14.6 8.2 13.8 11.6 10.2 11.6 9.4 8.2 12 5.2Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M12 5.2V3.2M9.4 8.2 6.2 6.8M14.6 8.2 17.8 6.8M10.2 11.6 7.8 14.8M13.8 11.6 16.2 14.8M9.4 8.2 10.2 11.6M14.6 8.2 13.8 11.6" />
    </svg>
  )
}

export function WhistleIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6.5" cy="17.5" r="2.5" />
      <path d="M9 17.5h2.5l7-7a2.5 2.5 0 0 0-3.5-3.5l-7 7V17.5Z" />
      <path d="M14 6.5 17.5 10" />
    </svg>
  )
}

export function StadiumIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 18c3-2 6-3 9-3s6 1 9 3" />
      <path d="M3 14c4-3 8-4.5 12-4.5S20 11 23 14" />
      <path d="M12 3v6.5" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function BroadcastIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M8.5 8.5a5.5 5.5 0 0 0 0 7" />
      <path d="M15.5 8.5a5.5 5.5 0 0 1 0 7" />
      <path d="M5 5a9.5 9.5 0 0 0 0 14" />
      <path d="M19 5a9.5 9.5 0 0 1 0 14" />
    </svg>
  )
}

export function FlagPennantIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 21V3" />
      <path d="M5 4h11l-2 4 2 4H5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function KickoffIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

export function TeamShieldIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z" />
      <path d="M9 12.5 11 14.5 15 10" />
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}
