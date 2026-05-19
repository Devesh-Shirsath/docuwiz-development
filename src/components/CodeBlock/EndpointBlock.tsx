import React, { useEffect, useRef, useState } from 'react';
import { CaretDown, Copy, Check, DownloadSimple, Play, CircleNotch } from '@phosphor-icons/react';
import { splitIntoLines, tokenize, LANGUAGES } from './tokenize';
import type { Language } from './tokenize';
import styles from './CodeBlock.module.css';

const TOKEN_CLASS: Record<string, string> = {
  key: styles.t_key, string: styles.t_string, url: styles.t_url,
  number: styles.t_number, boolean: styles.t_boolean, null: styles.t_null,
  keyword: styles.t_keyword, flag: styles.t_flag, comment: styles.t_comment,
  punctuation: styles.t_punctuation, default: styles.t_default,
};

export interface EndpointBlockProps {
  /**
   * Map of language → code snippet.
   * The component switches between them when the language is changed.
   */
  codeSamples: Partial<Record<Language | string, string>>;
  /** Initially selected language. Defaults to the first key in codeSamples. */
  defaultLanguage?: Language | string;
  /** List of languages to show in the selector. Defaults to keys of codeSamples. */
  languages?: (Language | string)[];
  /** Whether the run button should show a loading spinner. */
  isRunning?: boolean;
  /** Called when the ▶ button is clicked. */
  onRun?: (language: string, code: string) => void;
  /** Called when the copy button is clicked. Defaults to clipboard write. */
  onCopy?: (code: string) => void;
  /** Called when the download button is clicked. Defaults to file download. */
  onDownload?: (code: string, language: string) => void;
  /** Called when the active language changes. */
  onLanguageChange?: (language: string) => void;
  className?: string;
}

function languageLabel(lang: string): string {
  return LANGUAGES.find(l => l.value === lang)?.label ?? lang;
}

/**
 * Endpoint code panel — shows a request code snippet with a language switcher,
 * copy, download, and run (▶) actions.
 */
export function EndpointBlock({
  codeSamples,
  defaultLanguage,
  languages,
  isRunning = false,
  onRun,
  onCopy,
  onDownload,
  onLanguageChange,
  className,
}: EndpointBlockProps) {
  const sampleKeys      = Object.keys(codeSamples);
  const availableLangs  = languages ?? sampleKeys;
  const [activeLang, setActiveLang] = useState(defaultLanguage ?? sampleKeys[0] ?? 'shell');
  const [langOpen, setLangOpen]     = useState(false);
  const [copied, setCopied]         = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const code = codeSamples[activeLang] ?? codeSamples[sampleKeys[0]] ?? '';

  // Close dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  // Reset activeLang if codeSamples keys change
  useEffect(() => {
    if (!codeSamples[activeLang] && sampleKeys.length > 0) {
      setActiveLang(sampleKeys[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeSamples]);

  const handleLang = (lang: string) => {
    setActiveLang(lang);
    setLangOpen(false);
    onLanguageChange?.(lang);
  };

  const handleCopy = async () => {
    if (onCopy) { onCopy(code); }
    else {
      try { await navigator.clipboard.writeText(code); } catch { /* silent */ }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    if (onDownload) { onDownload(code, activeLang); return; }
    const ext = { shell: '.sh', javascript: '.js', typescript: '.ts', python: '.py',
      java: '.java', go: '.go', ruby: '.rb', php: '.php', csharp: '.cs' }[activeLang] ?? '.txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `request${ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  const lines = splitIntoLines(tokenize(code, activeLang));

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <span className={styles.headerLabel}>Endpoint</span>
        <div className={styles.headerActions}>

          {/* Language selector */}
          <div className={styles.selectorWrapper} ref={langRef}>
            <button
              type="button"
              className={styles.selectorBtn}
              onClick={() => setLangOpen(v => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              {languageLabel(activeLang)}
              <span className={[styles.selectorCaret, langOpen ? styles.selectorCaretOpen : ''].join(' ')}>
                <CaretDown size={10} weight="bold" />
              </span>
            </button>

            {langOpen && (
              <div className={styles.selectorMenu} role="listbox">
                {availableLangs.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    role="option"
                    aria-selected={lang === activeLang}
                    className={[styles.selectorItem, lang === activeLang ? styles.selectorItemActive : ''].join(' ')}
                    onClick={() => handleLang(lang)}
                  >
                    {languageLabel(lang)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Copy */}
          <button
            type="button"
            className={[styles.iconBtn, copied ? styles.iconBtnSuccess : ''].join(' ')}
            onClick={handleCopy}
            title="Copy to clipboard"
            aria-label="Copy code"
          >
            {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
          </button>

          {/* Download */}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleDownload}
            title="Download file"
            aria-label="Download code"
          >
            <DownloadSimple size={14} />
          </button>

          {/* Run */}
          <button
            type="button"
            className={[styles.runBtn, isRunning ? styles.runBtnRunning : ''].join(' ')}
            onClick={() => !isRunning && onRun?.(activeLang, code)}
            disabled={isRunning}
            title={isRunning ? 'Running…' : 'Run request'}
            aria-label={isRunning ? 'Running request' : 'Run request'}
          >
            {isRunning
              ? <CircleNotch size={13} weight="bold" style={{ animation: 'spin 0.7s linear infinite' }} />
              : <Play size={13} weight="fill" />
            }
          </button>
        </div>
      </div>

      {/* ── Code ───────────────────────────────────────────────────────────── */}
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
    </div>
  );
}
