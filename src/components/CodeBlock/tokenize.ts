/* =============================================================================
   LIGHTWEIGHT SYNTAX TOKENIZER
   Covers JSON, Shell/cURL, and generic string+comment detection for
   JavaScript, TypeScript, Python, Java, Ruby, PHP, C#, Go, etc.
   ============================================================================= */

export type TokenType =
  | 'default'
  | 'string'
  | 'key'        // JSON object key
  | 'number'
  | 'boolean'
  | 'null'
  | 'comment'
  | 'keyword'    // curl, import, return, …
  | 'flag'       // --header, -X
  | 'url'        // https://…
  | 'punctuation';

export interface Token {
  type: TokenType;
  value: string;
}

/* ---------------------------------------------------------------------------
   JSON
   --------------------------------------------------------------------------- */
function tokenizeJSON(code: string): Token[] {
  const out: Token[] = [];
  let i = 0;

  while (i < code.length) {
    const ch = code[i];

    // Whitespace
    if (/[ \t\r\n]/.test(ch)) {
      let ws = '';
      while (i < code.length && /[ \t\r\n]/.test(code[i])) ws += code[i++];
      out.push({ type: 'default', value: ws });
      continue;
    }

    // String
    if (ch === '"') {
      let str = '"';
      i++;
      while (i < code.length) {
        if (code[i] === '\\') { str += code[i] + (code[i + 1] ?? ''); i += 2; continue; }
        if (code[i] === '"') { str += code[i++]; break; }
        str += code[i++];
      }
      // Detect key: next non-whitespace char is ':'
      let j = i;
      while (j < code.length && /[ \t\r\n]/.test(code[j])) j++;
      out.push({ type: code[j] === ':' ? 'key' : 'string', value: str });
      continue;
    }

    // Number
    if (/[0-9]/.test(ch) || (ch === '-' && /[0-9]/.test(code[i + 1] ?? ''))) {
      let num = '';
      while (i < code.length && /[0-9.\-eE+]/.test(code[i])) num += code[i++];
      out.push({ type: 'number', value: num });
      continue;
    }

    // Literal keywords
    if (code.startsWith('true', i))  { out.push({ type: 'boolean', value: 'true'  }); i += 4; continue; }
    if (code.startsWith('false', i)) { out.push({ type: 'boolean', value: 'false' }); i += 5; continue; }
    if (code.startsWith('null', i))  { out.push({ type: 'null',    value: 'null'  }); i += 4; continue; }

    out.push({ type: 'punctuation', value: ch });
    i++;
  }

  return out;
}

/* ---------------------------------------------------------------------------
   Shell / cURL
   --------------------------------------------------------------------------- */
const SHELL_KEYWORDS = new Set([
  'curl', 'wget', 'http', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS',
]);

function tokenizeShell(code: string): Token[] {
  const out: Token[] = [];
  let i = 0;

  while (i < code.length) {
    const ch = code[i];

    // # comment
    if (ch === '#') {
      let c = '';
      while (i < code.length && code[i] !== '\n') c += code[i++];
      out.push({ type: 'comment', value: c });
      continue;
    }

    // --long-flag
    if (ch === '-' && code[i + 1] === '-') {
      let f = '';
      while (i < code.length && !/[ \t\r\n]/.test(code[i])) f += code[i++];
      out.push({ type: 'flag', value: f });
      continue;
    }

    // -X short flag
    if (ch === '-' && /[a-zA-Z]/.test(code[i + 1] ?? '')) {
      let f = '-'; i++;
      while (i < code.length && /[a-zA-Z]/.test(code[i])) f += code[i++];
      out.push({ type: 'flag', value: f });
      continue;
    }

    // 'single-quoted'
    if (ch === "'") {
      let s = "'"; i++;
      while (i < code.length && code[i] !== "'") s += code[i++];
      s += code[i] ?? ''; i++;
      const inner = s.slice(1, -1);
      out.push({ type: /^https?:\/\//.test(inner) ? 'url' : 'string', value: s });
      continue;
    }

    // "double-quoted"
    if (ch === '"') {
      let s = '"'; i++;
      while (i < code.length) {
        if (code[i] === '\\') { s += code[i] + (code[i + 1] ?? ''); i += 2; continue; }
        if (code[i] === '"') { s += code[i++]; break; }
        s += code[i++];
      }
      out.push({ type: 'string', value: s });
      continue;
    }

    // $VARIABLE
    if (ch === '$') {
      let v = '$'; i++;
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) v += code[i++];
      out.push({ type: 'keyword', value: v });
      continue;
    }

    // bare word
    if (/[a-zA-Z_]/.test(ch)) {
      let w = '';
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) w += code[i++];
      out.push({ type: SHELL_KEYWORDS.has(w) ? 'keyword' : 'default', value: w });
      continue;
    }

    out.push({ type: 'default', value: ch });
    i++;
  }

  return out;
}

/* ---------------------------------------------------------------------------
   Generic — strings + line/block comments
   Good enough for JS, TS, Python, Java, Go, Ruby, PHP, C#
   --------------------------------------------------------------------------- */
function tokenizeGeneric(code: string, lineComment: string): Token[] {
  const out: Token[] = [];
  let i = 0;

  while (i < code.length) {
    const ch = code[i];

    // Line comment
    if (lineComment && code.startsWith(lineComment, i)) {
      let c = '';
      while (i < code.length && code[i] !== '\n') c += code[i++];
      out.push({ type: 'comment', value: c });
      continue;
    }

    // Block comment /* … */
    if (ch === '/' && code[i + 1] === '*') {
      let c = '/*'; i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) c += code[i++];
      c += '*/'; i += 2;
      out.push({ type: 'comment', value: c });
      continue;
    }

    // Template literal
    if (ch === '`') {
      let s = '`'; i++;
      while (i < code.length && code[i] !== '`') {
        if (code[i] === '\\') s += code[i++];
        s += code[i++];
      }
      s += '`'; i++;
      out.push({ type: 'string', value: s });
      continue;
    }

    // String
    if (ch === '"' || ch === "'") {
      const q = ch; let s = q; i++;
      while (i < code.length && code[i] !== q) {
        if (code[i] === '\\') s += code[i++];
        s += code[i++];
      }
      s += q; i++;
      out.push({ type: 'string', value: s });
      continue;
    }

    out.push({ type: 'default', value: ch });
    i++;
  }

  return out;
}

/* ---------------------------------------------------------------------------
   Public API
   --------------------------------------------------------------------------- */
const LINE_COMMENT: Record<string, string> = {
  javascript: '//', typescript: '//', java: '//', csharp: '//',
  go: '//', swift: '//', kotlin: '//', rust: '//',
  python: '#', ruby: '#', php: '//', bash: '#', shell: '#',
};

export function tokenize(code: string, language: string): Token[] {
  switch (language) {
    case 'json':               return tokenizeJSON(code);
    case 'shell': case 'bash': case 'curl': return tokenizeShell(code);
    default:                   return tokenizeGeneric(code, LINE_COMMENT[language] ?? '//');
  }
}

/** Split a flat token list into per-line arrays (for numbered line rendering). */
export function splitIntoLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const tok of tokens) {
    const parts = tok.value.split('\n');
    for (let p = 0; p < parts.length; p++) {
      if (p > 0) lines.push([]);
      if (parts[p].length > 0) {
        lines[lines.length - 1].push({ type: tok.type, value: parts[p] });
      }
    }
  }
  return lines;
}

/* ---------------------------------------------------------------------------
   Language metadata
   --------------------------------------------------------------------------- */
export const LANGUAGES = [
  { label: 'Shell',      value: 'shell'      },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python',     value: 'python'     },
  { label: 'Java',       value: 'java'       },
  { label: 'Go',         value: 'go'         },
  { label: 'Ruby',       value: 'ruby'       },
  { label: 'PHP',        value: 'php'        },
  { label: 'C#',         value: 'csharp'     },
] as const;

export type Language = typeof LANGUAGES[number]['value'];

export const HTTP_STATUSES = [
  { code: 200, text: 'OK' },
  { code: 201, text: 'Created' },
  { code: 204, text: 'No Content' },
  { code: 400, text: 'Bad Request' },
  { code: 401, text: 'Unauthorized' },
  { code: 403, text: 'Forbidden' },
  { code: 404, text: 'Not Found' },
  { code: 409, text: 'Conflict' },
  { code: 422, text: 'Unprocessable Entity' },
  { code: 429, text: 'Too Many Requests' },
  { code: 500, text: 'Internal Server Error' },
] as const;

export type StatusCode = typeof HTTP_STATUSES[number]['code'];

export function statusColor(code: number): string {
  if (code >= 200 && code < 300) return '#3fb950';   // green
  if (code >= 300 && code < 400) return '#79c0ff';   // blue
  if (code >= 400 && code < 500) return '#e3b341';   // amber
  return '#f78166';                                   // red 5xx
}
