"use client";

interface RatingScaleProps {
  max: 5 | 10;
  value: number;
  onChange: (value: number) => void;
  lowLabel?: string;
  highLabel?: string;
}

export function RatingScale({ max, value, onChange, lowLabel, highLabel }: RatingScaleProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="group relative flex items-center justify-center"
            aria-label={`Rate ${n} out of ${max}`}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center text-xs font-sans font-medium ${
                n <= value
                  ? "bg-ravok-gold border-ravok-gold text-black"
                  : "border-white/20 text-white/40 hover:border-ravok-gold/50 hover:text-white/60"
              }`}
            >
              {n}
            </div>
          </button>
        ))}
      </div>
      {(lowLabel || highLabel) && (
        <div className="flex justify-between">
          {lowLabel && <span className="font-sans text-[10px] text-ravok-slate uppercase tracking-wider">{lowLabel}</span>}
          {highLabel && <span className="font-sans text-[10px] text-ravok-slate uppercase tracking-wider">{highLabel}</span>}
        </div>
      )}
    </div>
  );
}
