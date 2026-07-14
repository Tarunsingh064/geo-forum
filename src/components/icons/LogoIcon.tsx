export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Map pin — uses currentColor so it inherits text-black etc. */}
      <path
        d="M 256 120
           C 210 120 174 156 174 202
           C 174 254 224 296 256 340
           C 288 296 338 254 338 202
           C 338 156 302 120 256 120 Z"
        fill="currentColor"
      />
      <circle cx="256" cy="202" r="34" fill="white" />

      {/* Hook — fixed brass accent regardless of parent color */}
      <path
        d="M 256 340
           C 256 340 254 384 254 404
           C 254 428 272 446 296 446
           C 320 446 338 428 338 402
           C 338 386 328 374 314 371"
        fill="none"
        stroke="#C9973F"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
}