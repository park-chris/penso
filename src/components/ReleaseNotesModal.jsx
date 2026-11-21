import { useEffect } from 'react';
import { ArrowUpRight, Calendar, FileText, Tag, X } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

function renderInlineMarkdown(text) {
  // Handle inline code, bold, and markdown links safely without dangerouslySetInnerHTML
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-zinc-900 dark:text-zinc-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-indigo-600 underline decoration-indigo-500/40 underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function SimpleMarkdown({ content }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const elements = [];
  let listBuffer = [];

  const flushList = (keyPrefix) => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul
        key={`list-${keyPrefix}`}
        className="my-2.5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
      >
        {listBuffer.map((item, i) => (
          <li key={i}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      flushList(index);
      return;
    }

    if (line.startsWith('### ')) {
      flushList(index);
      elements.push(
        <h4
          key={index}
          className="mt-5 mb-2 text-sm font-bold text-zinc-900 dark:text-zinc-100"
        >
          {renderInlineMarkdown(line.slice(4))}
        </h4>
      );
      return;
    }

    if (line.startsWith('## ')) {
      flushList(index);
      elements.push(
        <h3
          key={index}
          className="mt-6 mb-2.5 border-b border-zinc-200/80 pb-1.5 text-base font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
        >
          {renderInlineMarkdown(line.slice(3))}
        </h3>
      );
      return;
    }

    if (line.startsWith('# ')) {
      flushList(index);
      elements.push(
        <h3
          key={index}
          className="mt-5 mb-2.5 text-lg font-bold text-zinc-900 dark:text-zinc-100"
        >
          {renderInlineMarkdown(line.slice(2))}
        </h3>
      );
      return;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      listBuffer.push(line.slice(2));
      return;
    }

    flushList(index);
    elements.push(
      <p
        key={index}
        className="my-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
      >
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  flushList('end');
  return <div>{elements}</div>;
}

export function ReleaseNotesModal({ isOpen, onClose, release, loading, error }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="release-notes-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#141B2B]/85"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200/80 px-6 py-4 dark:border-zinc-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="release-notes-title"
                className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
              >
                최신 업데이트 내역
              </h2>
              {release?.version && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <Tag className="h-3 w-3" />
                  {release.version}
                </span>
              )}
            </div>
            {release?.publishedAt && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>릴리즈 날짜: {release.publishedAt}</span>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="penso-scroll flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
              GitHub에서 최신 패치 노트를 불러오는 중입니다...
            </div>
          ) : release?.body ? (
            <SimpleMarkdown content={release.body} />
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                <FileText className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {error
                  ? '릴리즈 정보를 불러오지 못했습니다.'
                  : '등록된 패치 노트가 아직 없습니다.'}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                GitHub Releases 페이지에서 전체 버전 기록을 직접 확인하실 수 있습니다.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-200/70 bg-white/40 px-6 py-3.5 dark:border-white/[0.08] dark:bg-white/[0.02]">
          <a
            href={release?.htmlUrl || SITE_CONFIG.github.releasesPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <span>GitHub에서 전체 릴리즈 보기</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
