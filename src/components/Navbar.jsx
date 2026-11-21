import { useState } from 'react';
import { Coffee, Download, Menu, Moon, Sun, X } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { PensoLogo } from './PensoLogo';

const TABS = [
  { id: 'home', label: '홈' },
  { id: 'guide', label: '사용법' },
  { id: 'community', label: '문의' },
];

export function Navbar({
  activeTab,
  onSelectTab,
  onGoDownload,
  isDark,
  onToggleTheme,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabClick = (tabId) => {
    setMobileOpen(false);
    onSelectTab(tabId);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-40 bg-transparent">
      <div className="mx-auto flex h-15 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <button
          type="button"
          onClick={() => handleTabClick('home')}
          className="rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#142A52] dark:focus-visible:ring-sky-400"
          aria-label="Penso 홈으로 이동"
        >
          <PensoLogo />
        </button>

        {/* Center: Tabs (홈, 사용법, 문의 — no background fill) */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="주요 메뉴">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`py-1.5 text-sm transition-colors focus:outline-none ${
                  isActive
                    ? 'font-semibold text-[#0F172A] dark:text-white'
                    : 'font-medium text-slate-500 hover:text-[#0F172A] dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {SITE_CONFIG.BUY_ME_A_COFFEE_URL && (
            <a
              href={SITE_CONFIG.BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/60 px-3 text-xs font-medium text-slate-600 backdrop-blur-md transition-colors hover:bg-white/80 hover:text-[#0F172A] dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.09] dark:hover:text-white sm:inline-flex"
              aria-label="개발자에게 커피 한 잔 후원하기"
              title="개발자에게 커피 한 잔 후원하기"
            >
              <Coffee className="h-3.5 w-3.5 text-amber-500 dark:text-amber-300" />
              <span>후원</span>
            </a>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white/60 text-slate-600 backdrop-blur-md transition-colors hover:bg-white/80 hover:text-[#0F172A] dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.09] dark:hover:text-white"
            aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onGoDownload();
            }}
            className="hidden items-center gap-1.5 rounded-lg bg-[#142A52] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0D1E3D] dark:bg-white dark:text-[#0F1420] dark:hover:bg-zinc-200 sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" />
            <span>다운로드</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white/60 text-slate-600 backdrop-blur-md hover:bg-white/80 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.09] md:hidden"
            aria-label="메뉴 열기"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="bg-[#F8FAFC]/95 px-4 pb-4 pt-2 backdrop-blur-md dark:bg-[#0F1420]/95 md:hidden">
          <div className="flex flex-col gap-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-3 py-2.5 text-left text-sm transition-colors ${
                    isActive
                      ? 'font-semibold text-[#0F172A] dark:text-white'
                      : 'font-medium text-slate-500 hover:text-[#0F172A] dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            {SITE_CONFIG.BUY_ME_A_COFFEE_URL && (
              <a
                href={SITE_CONFIG.BUY_ME_A_COFFEE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-[#0F172A] dark:text-zinc-300 dark:hover:text-white"
              >
                <Coffee className="h-4 w-4 text-amber-500 dark:text-amber-300" />
                <span>커피 한 잔 후원하기</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onGoDownload();
              }}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#142A52] px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-[#0F1420]"
            >
              <Download className="h-4 w-4" />
              <span>다운로드</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
