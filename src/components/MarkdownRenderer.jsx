function resolveUrl(url, rawBaseUrl) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
  if (!rawBaseUrl) return url;
  const cleaned = url.replace(/^\.\//, '').replace(/^\//, '');
  return `${rawBaseUrl}/${cleaned}`;
}

function renderInline(text, rawBaseUrl) {
  const tokenRegex =
    /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-[#0F172A] dark:text-[#E6EAF2]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] text-[#142A52] dark:bg-[#192235] dark:text-sky-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic text-slate-700 dark:text-[#D2DBE8]">
          {part.slice(1, -1)}
        </em>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const href = resolveUrl(linkMatch[2], rawBaseUrl);
      return (
        <a
          key={idx}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#142A52] underline decoration-[#142A52]/35 underline-offset-4 hover:text-[#1D3F7A] dark:text-sky-300 dark:decoration-sky-400/40 dark:hover:text-sky-200"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export function MarkdownRenderer({ content, rawBaseUrl }) {
  const lines = (content || '').replace(/\r\n/g, '\n').split('\n');
  const elements = [];

  let listType = null;
  let listItems = [];
  let quoteLines = [];
  let inCodeBlock = false;
  let codeLines = [];

  const flushList = (key) => {
    if (!listType || listItems.length === 0) return;
    if (listType === 'ul') {
      elements.push(
        <ul
          key={`ul-${key}`}
          className="my-3.5 space-y-2 text-sm leading-[1.8] text-slate-600 dark:text-[#B5C0D2]"
        >
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#142A52]/60 dark:bg-sky-400/75" />
              <span>{renderInline(item, rawBaseUrl)}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol
          key={`ol-${key}`}
          className="my-3.5 list-decimal space-y-2 pl-5 text-sm leading-[1.8] text-slate-600 dark:text-[#B5C0D2]"
        >
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item, rawBaseUrl)}</li>
          ))}
        </ol>
      );
    }
    listType = null;
    listItems = [];
  };

  const flushQuote = (key) => {
    if (quoteLines.length === 0) return;
    elements.push(
      <blockquote
        key={`q-${key}`}
        className="my-4 rounded-r-xl border-l-2 border-[#142A52]/50 bg-white/55 px-4 py-3 text-sm leading-[1.75] text-slate-700 backdrop-blur-xs dark:border-sky-400/60 dark:bg-white/[0.035] dark:text-[#C5CEDD]"
      >
        {quoteLines.map((q, i) => (
          <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
            {renderInline(q, rawBaseUrl)}
          </p>
        ))}
      </blockquote>
    );
    quoteLines = [];
  };

  lines.forEach((rawLine, index) => {
    const trimmed = rawLine.trim();

    if (trimmed.startsWith('```')) {
      flushList(index);
      flushQuote(index);
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${index}`}
            className="penso-scroll my-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100 dark:border-[#232D42] dark:bg-[#0C101A] dark:text-[#D7DFEC]"
          >
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      return;
    }

    if (!trimmed) {
      flushList(index);
      flushQuote(index);
      return;
    }

    if (/^---+$/.test(trimmed)) {
      flushList(index);
      flushQuote(index);
      elements.push(
        <hr key={`hr-${index}`} className="my-7 border-slate-200 dark:border-[#202A3E]" />
      );
      return;
    }

    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      flushList(index);
      flushQuote(index);
      const src = resolveUrl(imgMatch[2], rawBaseUrl);
      elements.push(
        <figure key={`img-${index}`} className="my-5">
          <img
            src={src}
            alt={imgMatch[1] || ''}
            loading="lazy"
            className="w-full rounded-xl border border-slate-200 bg-white dark:border-[#232D42] dark:bg-[#141B2B]"
          />
          {imgMatch[1] && (
            <figcaption className="mt-2 text-center text-xs text-slate-500 dark:text-[#7D8BA1]">
              {imgMatch[1]}
            </figcaption>
          )}
        </figure>
      );
      return;
    }

    if (trimmed.startsWith('> ')) {
      flushList(index);
      quoteLines.push(trimmed.slice(2));
      return;
    }
    flushQuote(index);

    if (trimmed.startsWith('### ')) {
      flushList(index);
      elements.push(
        <h3
          key={index}
          className="mt-6 mb-2 text-[15px] font-bold text-[#0F172A] dark:text-[#E6EAF2]"
        >
          {renderInline(trimmed.slice(4), rawBaseUrl)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(index);
      elements.push(
        <h2
          key={index}
          className="mt-8 mb-3 text-base font-bold text-[#0F172A] dark:text-[#E6EAF2] sm:text-lg"
        >
          {renderInline(trimmed.slice(3), rawBaseUrl)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList(index);
      elements.push(
        <h2
          key={index}
          className="mt-8 mb-3 text-lg font-bold text-[#0F172A] dark:text-[#E6EAF2] sm:text-xl"
        >
          {renderInline(trimmed.slice(2), rawBaseUrl)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (listType && listType !== 'ul') flushList(index);
      listType = 'ul';
      listItems.push(trimmed.slice(2));
      return;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (listType && listType !== 'ol') flushList(index);
      listType = 'ol';
      listItems.push(olMatch[1]);
      return;
    }

    flushList(index);
    elements.push(
      <p key={index} className="my-3 text-sm leading-[1.8] text-slate-600 dark:text-[#B5C0D2]">
        {renderInline(trimmed, rawBaseUrl)}
      </p>
    );
  });

  flushList('end');
  flushQuote('end');

  return <div>{elements}</div>;
}
