export default function Spinner({ show }: { show: boolean }) {
  if (!show) {
    return null;
  }
  return (
    <svg width="100" height="100" className="animate-spin">
      <circle
        cx="50"
        cy="50"
        fill="none"
        r="25"
        strokeWidth="10"
        stroke="#E387FF"
        strokeDasharray="100 150"
      />
    </svg>
  );
}
