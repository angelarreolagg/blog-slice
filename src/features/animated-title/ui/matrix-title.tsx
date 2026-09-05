import { Fragment } from "react";

type MatrixTitleProps = {
  title: string;
};

type Glyph = {
  char: string;
  index: number;
};

// Grouped by word so the spaces between them stay real text nodes and the line
// can still break there; the characters inside carry the scan.
function toWords(title: string): Array<Array<Glyph>> {
  let index = 0;

  return title
    .split(" ")
    .filter(Boolean)
    .map((word) => [...word].map((char) => ({ char, index: index++ })));
}

export function MatrixTitle({ title }: MatrixTitleProps) {
  const words = toWords(title);
  const total = words.reduce((count, word) => count + word.length, 0);

  return (
    <>
      <span className="sr-only">{title}</span>
      <span
        aria-hidden
        className="matrix-title"
        style={{ "--n": total } as React.CSSProperties}
      >
        {words.map((word, wordIndex) => (
          <Fragment key={word[0]?.index}>
            {wordIndex > 0 ? " " : null}
            <span
              className="matrix-word"
              style={{ "--i": word[0]?.index ?? 0 } as React.CSSProperties}
            >
              {word.map(({ char, index }) => (
                <span
                  key={index}
                  className="matrix-char"
                  style={{ "--i": index } as React.CSSProperties}
                >
                  {char}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
}
