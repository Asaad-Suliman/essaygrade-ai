'use client';

import { scoreColor } from '@/lib/utils';

interface ScoreRadialProps {
  score: number;
  label: string;
}

export default function ScoreRadial({ score, label }: ScoreRadialProps) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{score}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-500 text-center">{label}</span>
    </div>
  );
}
