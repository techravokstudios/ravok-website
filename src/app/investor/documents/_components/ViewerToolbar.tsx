"use client";

type ViewerToolbarProps = {
  currentPage: number;
  numPages: number;
  fontSize: number;
  onFontSizeChange: (delta: number) => void;
  onBack: () => void;
};

export default function ViewerToolbar({
  currentPage,
  numPages,
  fontSize,
  onFontSizeChange,
  onBack,
}: ViewerToolbarProps) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 bg-black/95 px-4 backdrop-blur-sm">
      <button
        type="button"
        onClick={onBack}
        className="font-sans text-xs uppercase tracking-[0.2em] text-ravok-slate hover:text-ravok-gold"
      >
        ← Back
      </button>

      <div className="flex items-center gap-3 font-sans text-xs text-white/70">
        <span className="tabular-nums text-ravok-beige">
          {numPages > 0 ? `${currentPage} / ${numPages}` : "…"}
        </span>
      </div>

      <div className="flex items-center gap-1 font-sans text-xs text-white/60">
        <button
          type="button"
          onClick={() => onFontSizeChange(-2)}
          disabled={fontSize <= 12}
          className="px-1.5 py-0.5 hover:text-ravok-gold disabled:opacity-30"
          aria-label="Decrease font size"
        >
          A−
        </button>
        <button
          type="button"
          onClick={() => onFontSizeChange(2)}
          disabled={fontSize >= 24}
          className="px-1.5 py-0.5 hover:text-ravok-gold disabled:opacity-30"
          aria-label="Increase font size"
        >
          A+
        </button>
      </div>
    </div>
  );
}
