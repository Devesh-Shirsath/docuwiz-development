import React, { useState } from 'react';
import { EndpointBlock } from './EndpointBlock';
import { ResponseBlock }  from './ResponseBlock';
import type { EndpointBlockProps } from './EndpointBlock';
import type { ResponseEntry }      from './ResponseBlock';
import styles from './CodeBlock.module.css';

export interface TryoutPanelProps {
  /** Code snippets per language for the endpoint panel. */
  codeSamples: EndpointBlockProps['codeSamples'];
  defaultLanguage?: EndpointBlockProps['defaultLanguage'];
  languages?: EndpointBlockProps['languages'];

  /**
   * Pre-defined response examples shown in the response panel.
   * If omitted the response panel shows a "Hit ▶ to run" placeholder.
   */
  responses?: ResponseEntry[];

  /**
   * Simulates an async request when the run button is pressed.
   * Receives the active language + raw code string.
   * Return a ResponseEntry (or array of them) to display in the response panel,
   * or void to keep the pre-defined `responses` unchanged.
   */
  onRun?: (
    language: string,
    code: string,
  ) => ResponseEntry | ResponseEntry[] | Promise<ResponseEntry | ResponseEntry[]> | void | Promise<void>;

  className?: string;
}

const IDLE_PLACEHOLDER: ResponseEntry = {
  code: 0,
  text: 'No response yet',
  body: '// Press ▶ to send the request',
  language: 'shell',
};

/**
 * TryoutPanel — the full "try it out" widget.
 *
 * Stacks an **EndpointBlock** above a **ResponseBlock**. When the ▶ button is
 * pressed it calls `onRun`, shows a loading spinner, then displays whatever
 * `onRun` resolves to.  If `responses` are pre-provided they show immediately.
 */
export function TryoutPanel({
  codeSamples,
  defaultLanguage,
  languages,
  responses,
  onRun,
  className,
}: TryoutPanelProps) {
  const initial = responses?.length ? responses : [IDLE_PLACEHOLDER];
  const [currentResponses, setCurrentResponses] = useState<ResponseEntry[]>(initial);
  const [isRunning, setIsRunning] = useState(false);

  // Keep responses in sync if the prop changes (e.g. Storybook controls)
  React.useEffect(() => {
    if (responses?.length) setCurrentResponses(responses);
  }, [responses]);

  const handleRun = async (lang: string, code: string) => {
    if (!onRun) return;
    setIsRunning(true);
    try {
      const result = await onRun(lang, code);
      if (result) {
        setCurrentResponses(Array.isArray(result) ? result : [result]);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const isIdle    = currentResponses[0] === IDLE_PLACEHOLDER;
  const isLoading = isRunning;

  return (
    <div className={[styles.tryoutPanel, className].filter(Boolean).join(' ')}>
      <EndpointBlock
        codeSamples={codeSamples}
        defaultLanguage={defaultLanguage}
        languages={languages}
        isRunning={isRunning}
        onRun={handleRun}
      />
      <ResponseBlock
        responses={isIdle ? [IDLE_PLACEHOLDER] : currentResponses}
        isLoading={isLoading}
      />
    </div>
  );
}
