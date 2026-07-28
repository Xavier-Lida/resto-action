export default function Buoy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      <circle cx="80" cy="80" r="52" fill="#ffffff" stroke="#f1f1ef" strokeWidth="34" />
      <circle
        cx="80"
        cy="80"
        r="52"
        fill="none"
        stroke="#ff3008"
        strokeWidth="34"
        strokeDasharray="40.84 40.84"
      />
      <circle cx="80" cy="80" r="69" fill="none" stroke="#191919" strokeWidth="5" />
      <circle cx="80" cy="80" r="35" fill="#ffffff" stroke="#191919" strokeWidth="5" />
    </svg>
  );
}
