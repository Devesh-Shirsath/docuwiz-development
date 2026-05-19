import React, { useEffect, useRef, useState } from 'react';
import { CaretDown, Copy, Check } from '@phosphor-icons/react';
import { splitIntoLines, tokenize, statusColor, HTTP_STATUSES } from './tokenize';
import type { StatusCode } from './tokenize';
import styles from './CodeBlock.module.css';

const TOKEN_CLASS: Record<string, string> = {
  key: styles.t_key, string: styles.t_string, url: styles.t_url,
  number: styles.t_number, boolean: styles.t_boolean, null: styles.t_null,
  keyword: styles.t_keyword, flag: styles.t_flag, comment: styles.t_comment,
  punctuation: styles.t_punctuation, default: styles.t_default,
};

export interface ResponseEntry {
  code: number;
  text: string;
  body: string;
  language?: string;
}

export interface ResponseBlockProps {
  /**
   * All available responses. The component renders a status-code selector
   * when more than one is provided.
   */
  responses: ResponseEntry[];
  /** Initially selected status code. Defaults to first entry. */
  defaultStatus?: number;
  /** Show the placeholder loading state (used while waiting for a live response). */
  isLoading?: boolean;
  /** Called when the user changes the active status code. */
  onStatusChange?: (entry: ResponseEntry) => void;
  className?: string;
}

/**
 * Response panel — renders the response body with syntax highlighting and a
 * colour-coded status-code selector (green=2xx, amber=4xx, red=5xx).
 */
export function ResponseBlock({
  responses,
  defaultStatus,
  isLoading = false,
  onStatusChange,
  className,
}: ResponseBlockProps) {
  const first       = responses[0];
  const [active, setActive] = useState<ResponseEntry>(
    responses.find(r => r.code === defaultStatus) ?? first
  );
  const [open,   setOpen]   = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Sync if responses list changes (e.g. after a live run)
  useEffect(() => {
    const match = responses.find(r => r.code === active.code);
    setActive(match ?? responses[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responses]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (entry: ResponseEntry) => {
    setActive(entry);
    setOpen(false);
    onStatusChange?.(entry);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(active.body); } catch { /* silent */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const color  = statusColor(active.code);
  const lang   = active.language ?? 'json';
  const lines  = splitIntoLines(tokenize(active.body, lang));

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <span className={styles.headerLabel}>Response</span>
        <div className={styles.headerActions}>

          {/* Copy */}
          {!isLoading && (
            <button
              type="button"
              className={[styles.iconBtn, copied ? styles.iconBtnSuccess : ''].join(' ')}
              onClick={handleCopy}
              title="Copy response"
              aria-label="Copy response"
            >
              {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
            </button>
          )}

          {/* Status selector */}
          <div className={styles.selectorWrapper} ref={ref}>
            <button
              type="button"
              className={styles.selectorBtn}
              onClick={() => responses.length > 1 && setOpen(v => !v)}
              style={{ cursor: responses.length > 1 ? 'pointer' : 'default' }}
              aria-haspopup={responses.length > 1 ? 'listbox' : undefined}
              aria-expanded={responses.length > 1 ? open : undefined}
            >
              <span
                className={styles.statusDot}
                style={{ background: color }}
                aria-hidden
              />
              <span style={{ color }}>{active.code}&nbsp;{active.text}</span>
              {responses.length > 1 && (
                <span className={[styles.selectorCaret, open ? styles.selectorCaretOpen : ''].join(' ')}>
                  <CaretDown size={10} weight="bold" />
                </span>
              )}
            </button>

            {open && responses.length > 1 && (
              <div className={styles.selectorMenu} role="listbox">
                {responses.map(r => (
                  <button
                    key={r.code}
                    type="button"
                    role="option"
                    aria-selected={r.code === active.code}
                    className={[styles.selectorItem, r.code === active.code ? styles.selectorItemActive : ''].join(' ')}
                    onClick={() => handleSelect(r)}
                  >
                    <span
                      className={styles.statusDot}
                      style={{ background: statusColor(r.code), marginRight: 6 }}
                    />
                    <span style={{ color: statusColor(r.code) }}>{r.code}</span>
                    &nbsp;<span style={{ opacity: 0.7 }}>{r.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className={styles.placeholder}>
          <span className={styles.spinner} />
          Waiting for response…
        </div>
      ) : (
        <div className={styles.codeArea}>
          {lines.map((lineTokens, i) => (
            <div key={i} className={styles.codeLine}>
              <span className={styles.lineNum} aria-hidden>{i + 1}</span>
              <span className={styles.lineContent}>
                {lineTokens.length === 0
                  ? ' '
                  : lineTokens.map((tok, j) => (
                      <span key={j} className={TOKEN_CLASS[tok.type] ?? styles.t_default}>
                        {tok.value}
                      </span>
                    ))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
