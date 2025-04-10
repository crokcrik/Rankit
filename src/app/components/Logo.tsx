import { Crown } from 'lucide-react';

export default function Logo({ size = 'default' }: { size?: 'default' | 'large' }) {
  const baseTextClass = "font-extrabold tracking-tight";
  const textClass = size === 'large' 
    ? `${baseTextClass} text-5xl` 
    : `${baseTextClass} text-2xl`;

  return (
    <div className="flex items-center gap-2">
      <Crown 
        className={`text-accent ${size === 'large' ? 'w-12 h-12' : 'w-8 h-8'}`}
        strokeWidth={2.5}
      />
      <div className={textClass}>
        <span className="text-text-primary">Rank</span>
        <span className="text-accent">it!</span>
      </div>
    </div>
  );
} 