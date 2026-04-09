import React from "react";

type Strength = "weak" | "fair" | "strong" | "very-strong";

const getStrength = (password: string): { level: Strength; score: number; label: string } => {
  const len = password.length;

  if (len < 6) return { level: "weak", score: 1, label: "Weak" };

  let score = 0;
  if (len >= 8) score++;
  if (len >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: "weak", score: 1, label: "Weak" };
  if (score === 2) return { level: "fair", score: 2, label: "Fair" };
  if (score === 3) return { level: "strong", score: 3, label: "Strong" };
  return { level: "very-strong", score: 4, label: "Very strong" };
};

const segmentColor: Record<Strength, string> = {
  weak: "bg-red-500",
  fair: "bg-orange-400",
  strong: "bg-yellow-400",
  "very-strong": "bg-green-500",
};

const labelColor: Record<Strength, string> = {
  weak: "text-red-500",
  fair: "text-orange-400",
  strong: "text-yellow-400",
  "very-strong": "text-green-500",
};

type Props = {
  password: string;
};

export const PasswordStrengthIndicator = ({ password }: Props) => {
  const { level, score, label } = getStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? segmentColor[level] : "bg-bg-input-soft"}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${labelColor[level]}`}>{label}</p>
    </div>
  );
};
