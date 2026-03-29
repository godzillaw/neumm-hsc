export default function NeummLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Neumm"
    >
      <rect width="48" height="48" rx="12" fill="#185FA5" />
      {/* N letterform */}
      <path
        d="M13 35V13h4.5l13 15.5V13H35v22h-4.5L17.5 19.5V35H13z"
        fill="white"
      />
    </svg>
  )
}
