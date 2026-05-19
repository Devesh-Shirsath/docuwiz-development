import React from 'react';
import { splitIntoLines, tokenize } from './tokenize';
import type { Language } from './tokenize';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
  code: string;
  language: Language | 'json' | 'curl' | string;
  showLineNumbers?: boolean;
  maxHeight?: number | string;
  className?: string;
}

/** Token type → CSS class name mapping */
const TOKEN_CLASS: Record<string, string> = {
  key:         styles.t_key,
  string:      styles.t_string,
  url:         styles.t_url,
  number:      styles.t_number,
  boolean:     styles.t_boolean,
  null:        styles.t_null,
  keyword:     styles.t_keyword,
  flag:        styles.t_flag,
  comment:     styles.t_comment,
  punctuation: styles.t_punctuation,
  default:     styles.t_default,
};

/**
 * Base syntax-highlighted code renderer with optional line numbers.
 * Always renders on a dark surface — designed for API docs / tryout panels.
 */
export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  maxHeight,
  className,
}: CodeBlockProps) {
  const tokens  = tokenize(code, language);
  const lines   = splitIntoLines(tokens);

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <div className={styles.codeArea} style={maxHeight ? { maxHeight } : undefined}>
        {lines.map((lineTokens, i) => (
          <div key={i} className={styles.codeLine}>
            {showLineNumbers && (
              <span className={styles.lineNum} aria-hidden>{i + 1}</span>
            )}
            <span className={styles.lineContent}>
              {lineTokens.length === 0
                ? ' ' /* non-breaking space keeps empty lines visible */
                : lineTokens.map((tok, j) => (
                    <span key={j} className={TOKEN_CLASS[tok.type] ?? styles.t_default}>
                      {tok.value}
                    </span>
                  ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
