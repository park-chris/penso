import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  List,
  RefreshCw,
} from 'lucide-react';
import { useGuideDocs } from '../hooks/useGuideDocs';
import { MarkdownRenderer } from './MarkdownRenderer';

export function GuidePage() {
  const { groups, docContent, docLoading, loadDoc, rawBaseUrl } = useGuideDocs();

  const allDocs = useMemo(
    () =>
      groups.flatMap((group) =>
        (group.docs || []).map((doc) => ({ ...doc, groupLabel: group.label }))
      ),
    [groups]
  );

  const [activeDocId, setActiveDocId] = useState(() => allDocs[0]?.id || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({});

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      groups.forEach((g) => {
        if (next[g.id] === undefined) next[g.id] = true;
      });
      return next;
    });

    if (allDocs.length > 0 && !allDocs.some((d) => d.id === activeDocId)) {
      setActiveDocId(allDocs[0].id);
    }
  }, [groups, allDocs, activeDocId]);

  const activeIndex = allDocs.findIndex((d) => d.id === activeDocId);
  const currentDoc = allDocs[activeIndex] || allDocs[0];
  const prevDoc = activeIndex > 0 ? allDocs[activeIndex - 1] : null;
  const nextDoc =
    activeIndex >= 0 && activeIndex < allDocs.length - 1
      ? allDocs[activeIndex + 1]
      : null;

  useEffect(() => {
    return loadDoc(currentDoc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDoc?.id, currentDoc?.file, groups]);

  const handleSelectDoc = (docId) => {
    setActiveDocId(docId);
    setMobileMenuOpen(false);
    document
      .getElementById('page-scroll-container')
      ?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  if (!currentDoc) return null;

  return (
    <div className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Mobile Collapsible TOC */}
        <div className="mb-6 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white/60 px-4 py-3 text-xs font-semibold text-[#0F172A] backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-[#E6EAF2]"
          >
            <span className="inline-flex items-center gap-2">
              <List className="h-4 w-4 text-[#142A52] dark:text-sky-300" />
              <span>목차 · {currentDoc.title}</span>
            </span>
            {mobileMenuOpen ? (
              <ChevronDown className="h-4 w-4 text-slate-400 dark:text-[#8C9AB0]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400 dark:text-[#8C9AB0]" />
            )}
          </button>

          {mobileMenuOpen && (
            <nav className="mt-2 space-y-3 rounded-xl border border-slate-200/80 bg-white/75 p-4 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.04]">
              {groups.map((group) => (
                <div key={group.id}>
                  <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-[#7D8BA1]">
                    {group.label}
                  </div>
                  <ul className="mt-1.5 space-y-0.5">
                    {(group.docs || []).map((doc) => {
                      const active = doc.id === activeDocId;
                      return (
                        <li key={doc.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectDoc(doc.id)}
                            className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                              active
                                ? 'bg-[#142A52]/[0.08] font-semibold text-[#142A52] dark:bg-sky-400/12 dark:text-sky-200'
                                : 'text-slate-600 hover:text-[#0F172A] dark:text-[#A8B3C5] dark:hover:text-[#E6EAF2]'
                            }`}
                          >
                            {doc.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* Desktop 2-Column Wiki Layout: Left Collapsible Sidebar + Right Article */}
        <div className="flex items-start gap-8 lg:gap-12">
          {/* Left Sidebar TOC (always open on desktop; collapsible on narrow screens above) */}
          <aside className="sticky top-6 hidden w-60 shrink-0 lg:block">
            <div className="mb-4 flex items-center px-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F172A] dark:text-[#E6EAF2]">
                <List className="h-3.5 w-3.5 text-[#142A52] dark:text-sky-300" />
                <span>사용법 목차</span>
              </span>
            </div>

            <nav aria-label="사용법 목차" className="space-y-4">
              {groups.map((group) => {
                const isExpanded = openGroups[group.id] !== false;
                return (
                  <div key={group.id}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className="flex w-full items-center justify-between px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-700 dark:text-[#7D8BA1] dark:hover:text-[#B5C0D2]"
                    >
                      <span>{group.label}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {isExpanded && (
                      <ul className="ml-2 mt-1 space-y-0.5 border-l border-slate-200 pl-2.5 dark:border-[#232D42]">
                        {(group.docs || []).map((doc) => {
                          const active = doc.id === activeDocId;
                          return (
                            <li key={doc.id}>
                              <button
                                type="button"
                                onClick={() => handleSelectDoc(doc.id)}
                                className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                                  active
                                    ? 'bg-[#142A52]/[0.08] font-semibold text-[#142A52] dark:bg-sky-400/12 dark:text-sky-200'
                                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-[#0F172A] dark:text-[#9BA8BD] dark:hover:bg-white/[0.04] dark:hover:text-[#E6EAF2]'
                                }`}
                              >
                                {doc.title}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* Main Wiki Reading Column */}
          <article className="min-w-0 max-w-3xl flex-1">
            {/* Category Label */}
            <div className="text-xs font-semibold text-[#142A52] dark:text-sky-300">
              {currentDoc.groupLabel}
            </div>

            {/* Doc Title & Lead */}
            <h1 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#0F172A] dark:text-[#E6EAF2] sm:text-3xl">
              {currentDoc.title}
            </h1>
            {currentDoc.lead && (
              <p className="mt-2.5 text-sm leading-[1.75] text-slate-500 dark:text-[#9BA8BD] sm:text-[15px]">
                {currentDoc.lead}
              </p>
            )}

            {/* Markdown Body */}
            <div className="mt-8 border-t border-slate-200 pt-6 dark:border-[#202A3E]">
              {docLoading ? (
                <div className="flex items-center gap-2 py-12 text-sm text-slate-500 dark:text-[#7D8BA1]">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>문서를 불러오는 중...</span>
                </div>
              ) : (
                <MarkdownRenderer content={docContent} rawBaseUrl={rawBaseUrl} />
              )}
            </div>

            {/* Prev / Next Chapter Navigation */}
            <div className="mt-14 flex items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-[#202A3E]">
              {prevDoc ? (
                <button
                  type="button"
                  onClick={() => handleSelectDoc(prevDoc.id)}
                  className="group flex flex-col items-start py-1 text-left transition-colors"
                >
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-[#142A52] dark:text-[#7D8BA1] dark:group-hover:text-sky-300">
                    <ArrowLeft className="h-3 w-3" />
                    이전
                  </span>
                  <span className="mt-1 text-sm font-semibold text-[#0F172A] group-hover:text-[#142A52] dark:text-[#E6EAF2] dark:group-hover:text-sky-200">
                    {prevDoc.title}
                  </span>
                </button>
              ) : (
                <div />
              )}

              {nextDoc && (
                <button
                  type="button"
                  onClick={() => handleSelectDoc(nextDoc.id)}
                  className="group flex flex-col items-end py-1 text-right transition-colors"
                >
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-[#142A52] dark:text-[#7D8BA1] dark:group-hover:text-sky-300">
                    다음
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="mt-1 text-sm font-semibold text-[#0F172A] group-hover:text-[#142A52] dark:text-[#E6EAF2] dark:group-hover:text-sky-200">
                    {nextDoc.title}
                  </span>
                </button>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
