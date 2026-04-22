export type ParsedLine = {
  text: string;
  fontSize: number;
  fontName: string;
  isBold: boolean;
  isItalic: boolean;
  y: number;
};

export type ParsedParagraph = {
  lines: string[];
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isHeading: boolean;
  headingLevel: 2 | 3 | 0;
};

type TextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName: string;
  hasEOL: boolean;
};

type TextContent = {
  items: (TextItem | { type: string })[];
  styles: Record<string, { fontFamily: string }>;
};

function getFontSize(item: TextItem): number {
  return Math.abs(item.transform[0]) || Math.abs(item.transform[3]) || 12;
}

function getY(item: TextItem): number {
  return item.transform[5];
}

function getX(item: TextItem): number {
  return item.transform[4];
}

function isBoldFont(fontName: string, styles: Record<string, { fontFamily: string }>): boolean {
  const name = (fontName + (styles[fontName]?.fontFamily ?? "")).toLowerCase();
  return name.includes("bold") || name.includes("black") || name.includes("heavy");
}

function isItalicFont(fontName: string, styles: Record<string, { fontFamily: string }>): boolean {
  const name = (fontName + (styles[fontName]?.fontFamily ?? "")).toLowerCase();
  return name.includes("italic") || name.includes("oblique");
}

function groupByLine(items: TextItem[], styles: Record<string, { fontFamily: string }>): ParsedLine[] {
  if (items.length === 0) return [];

  const sorted = [...items].sort((a, b) => getY(b) - getY(a) || getX(a) - getX(b));

  const lines: ParsedLine[] = [];
  let currentY = getY(sorted[0]);
  let currentParts: string[] = [];
  let currentFontSize = getFontSize(sorted[0]);
  let currentFontName = sorted[0].fontName;
  let lastX = 0;

  for (const item of sorted) {
    const y = getY(item);
    const fontSize = getFontSize(item);
    const yTolerance = fontSize * 0.5;

    if (Math.abs(y - currentY) > yTolerance && currentParts.length > 0) {
      lines.push({
        text: currentParts.join("").trim(),
        fontSize: currentFontSize,
        fontName: currentFontName,
        isBold: isBoldFont(currentFontName, styles),
        isItalic: isItalicFont(currentFontName, styles),
        y: currentY,
      });
      currentParts = [];
      currentFontSize = fontSize;
      currentFontName = item.fontName;
      lastX = 0;
    }

    currentY = y;
    const x = getX(item);
    if (currentParts.length > 0 && x - lastX > fontSize * 0.3) {
      currentParts.push(" ");
    }
    currentParts.push(item.str);
    lastX = x + item.width;
  }

  if (currentParts.length > 0) {
    lines.push({
      text: currentParts.join("").trim(),
      fontSize: currentFontSize,
      fontName: currentFontName,
      isBold: isBoldFont(currentFontName, styles),
      isItalic: isItalicFont(currentFontName, styles),
      y: currentY,
    });
  }

  return lines.filter((l) => l.text.length > 0);
}

function groupIntoParagraphs(lines: ParsedLine[]): ParsedParagraph[] {
  if (lines.length === 0) return [];

  const allFontSizes = lines.map((l) => l.fontSize);
  allFontSizes.sort((a, b) => a - b);
  const medianFontSize = allFontSizes[Math.floor(allFontSizes.length / 2)];

  const paragraphs: ParsedParagraph[] = [];
  let currentLines: string[] = [lines[0].text];
  let currentFontSize = lines[0].fontSize;
  let currentBold = lines[0].isBold;
  let currentItalic = lines[0].isItalic;
  let prevY = lines[0].y;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const yGap = Math.abs(prevY - line.y);
    const sameStyle = Math.abs(line.fontSize - currentFontSize) < 1;
    const isNewParagraph = yGap > currentFontSize * 1.8 || !sameStyle;

    if (isNewParagraph) {
      paragraphs.push(makeParagraph(currentLines, currentFontSize, currentBold, currentItalic, medianFontSize));
      currentLines = [];
      currentFontSize = line.fontSize;
      currentBold = line.isBold;
      currentItalic = line.isItalic;
    }

    currentLines.push(line.text);
    prevY = line.y;
  }

  if (currentLines.length > 0) {
    paragraphs.push(makeParagraph(currentLines, currentFontSize, currentBold, currentItalic, medianFontSize));
  }

  return paragraphs;
}

function makeParagraph(
  lines: string[],
  fontSize: number,
  isBold: boolean,
  isItalic: boolean,
  medianFontSize: number
): ParsedParagraph {
  const ratio = fontSize / medianFontSize;
  const isHeading = ratio > 1.25 || (isBold && ratio > 1.05);
  const headingLevel: 2 | 3 | 0 = ratio > 1.5 ? 2 : isHeading ? 3 : 0;

  return { lines, fontSize, isBold, isItalic, isHeading, headingLevel };
}

export function parseTextContent(textContent: TextContent): ParsedParagraph[] {
  const items = textContent.items.filter(
    (item): item is TextItem => "str" in item && typeof item.str === "string"
  );
  if (items.length === 0) return [];

  const lines = groupByLine(items, textContent.styles);
  return groupIntoParagraphs(lines);
}

export function hasEnoughText(textContent: TextContent): boolean {
  const items = textContent.items.filter(
    (item): item is TextItem => "str" in item && item.str.trim().length > 0
  );
  return items.length >= 5;
}
