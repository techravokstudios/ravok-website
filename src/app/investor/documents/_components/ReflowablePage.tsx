"use client";

import { forwardRef } from "react";
import type { ParsedParagraph } from "./pdf-text-parser";

type ReflowablePageProps = {
  pageNumber: number;
  paragraphs: ParsedParagraph[];
  fontSize: number;
  isLast: boolean;
};

const ReflowablePage = forwardRef<HTMLDivElement, ReflowablePageProps>(
  function ReflowablePage({ pageNumber, paragraphs, fontSize, isLast }, ref) {
    return (
      <div ref={ref} data-page={pageNumber} className={`px-4 py-6 sm:px-6 ${isLast ? "" : "border-b border-white/8"}`}>
        <div className="mx-auto max-w-[720px]">
          <div className="mb-4 font-sans text-[10px] uppercase tracking-[0.3em] text-white/20">
            Page {pageNumber}
          </div>
          {paragraphs.map((p, i) => {
            const text = p.lines.join(" ");
            const style = { fontSize: `${p.isHeading ? fontSize * (p.headingLevel === 2 ? 1.5 : 1.25) : fontSize}px` };

            if (p.headingLevel === 2) {
              return (
                <h2
                  key={i}
                  className="mb-3 mt-6 font-heading font-light leading-tight text-white first:mt-0"
                  style={style}
                >
                  {text}
                </h2>
              );
            }
            if (p.headingLevel === 3) {
              return (
                <h3
                  key={i}
                  className="mb-2 mt-5 font-heading font-light leading-tight text-ravok-beige first:mt-0"
                  style={style}
                >
                  {text}
                </h3>
              );
            }
            return (
              <p
                key={i}
                className={`mb-3 font-sans leading-relaxed ${p.isBold ? "font-medium text-white/90" : "font-light text-white/75"} ${p.isItalic ? "italic" : ""}`}
                style={style}
              >
                {text}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
);

export default ReflowablePage;
