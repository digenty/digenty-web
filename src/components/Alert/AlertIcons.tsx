export default function AlertIcons({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width={20} height={20} fill="none" viewBox="0 0 24 24">
      <path d="M12 2a7 7 0 0 1 7 7v5l1.29 2.58A1 1 0 0 1 19.42 18H4.58a1 1 0 0 1-.87-1.42L5 14V9a7 7 0 0 1 7-7z" fill={color} />
    </svg>
  );
}
