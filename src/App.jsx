import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Download,
  RefreshCw,
} from 'lucide-react';
import { getPrimaryDownloadInfo, useLatestRelease } from './hooks/useLatestRelease';
import { useUserOS } from './hooks/useUserOS';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { SlideIndicator } from './components/SlideIndicator';
import { HeroMockup } from './components/HeroMockup';
import { FeaturesBento } from './components/FeaturesBento';
import { CustomWidgetsSection } from './components/CustomWidgetsSection';
import { SyncSecuritySection } from './components/SyncSecuritySection';
import { DownloadSection } from './components/DownloadSection';
import { GuidePage } from './components/GuidePage';
import { CommunityPage } from './components/CommunityPage';
import { Footer } from './components/Footer';

const VALID_TABS = new Set(['home', 'guide', 'community']);

const HOME_SLIDES = [
  { id: 'hero', label: '시작' },
  { id: 'ownership', label: '보안 · 동기화' },
  { id: 'features', label: '주요 기능' },
  { id: 'widgets', label: '커스텀 위젯' },
  { id: 'download', label: '다운로드' },
];

function getInitialTab() {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace('#', '');
  if (VALID_TABS.has(hash)) return hash;
  return 'home';
}

export default function App() {
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return true;
    return document.documentElement.classList.contains('dark');
  });

  const snapContainerRef = useRef(null);
  const slideRefs = useRef([]);
  const wheelLockRef = useRef(false);
  const activeSlideRef = useRef(0);
  const programmaticTargetRef = useRef(null);
  const programmaticTimerRef = useRef(null);

  const { release, loading, error, retry } = useLatestRelease();
  const userOS = useUserOS();

  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('penso-theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [isDark]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_TABS.has(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const scrollToSlide = useCallback((index) => {
    const clamped = Math.max(0, Math.min(HOME_SLIDES.length - 1, index));
    const container = snapContainerRef.current;
    const el = slideRefs.current[clamped];
    if (!container || !el) return;

    programmaticTargetRef.current = clamped;
    if (programmaticTimerRef.current) {
      clearTimeout(programmaticTimerRef.current);
    }
    programmaticTimerRef.current = setTimeout(() => {
      programmaticTargetRef.current = null;
    }, 750);

    setActiveSlide(clamped);
    container.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  }, []);

  // Track active slide smoothly via rAF-throttled scroll position (no flicker during transitions)
  useEffect(() => {
    if (activeTab !== 'home') return undefined;
    const container = snapContainerRef.current;
    if (!container) return undefined;

    let rafId = null;

    const updateActiveSlide = () => {
      rafId = null;

      if (programmaticTargetRef.current !== null) {
        const targetEl = slideRefs.current[programmaticTargetRef.current];
        if (targetEl && Math.abs(container.scrollTop - targetEl.offsetTop) <= 8) {
          programmaticTargetRef.current = null;
          if (programmaticTimerRef.current) {
            clearTimeout(programmaticTimerRef.current);
            programmaticTimerRef.current = null;
          }
        }
        return;
      }

      const centerY = container.scrollTop + container.clientHeight * 0.5;
      let nearestIdx = 0;
      let minDist = Infinity;

      slideRefs.current.forEach((el, idx) => {
        if (!el) return;
        const slideCenter = el.offsetTop + el.offsetHeight * 0.5;
        const dist = Math.abs(centerY - slideCenter);
        if (dist < minDist) {
          minDist = dist;
          nearestIdx = idx;
        }
      });

      if (nearestIdx !== activeSlideRef.current) {
        setActiveSlide(nearestIdx);
      }
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateActiveSlide);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (programmaticTimerRef.current) clearTimeout(programmaticTimerRef.current);
    };
  }, [activeTab]);

  // Smooth one-slide-at-a-time mouse wheel & keyboard navigation on desktop
  useEffect(() => {
    if (activeTab !== 'home') return undefined;
    const container = snapContainerRef.current;
    if (!container) return undefined;

    const handleWheel = (e) => {
      if (window.innerWidth < 768) return;
      if (Math.abs(e.deltaY) < 12) return;

      const scrollableChild = e.target.closest?.('.penso-scroll');
      if (scrollableChild && scrollableChild.scrollHeight > scrollableChild.clientHeight + 2) {
        const atTop = scrollableChild.scrollTop <= 0;
        const atBottom =
          scrollableChild.scrollTop + scrollableChild.clientHeight >=
          scrollableChild.scrollHeight - 2;
        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
          return;
        }
      }

      const currentIdx = activeSlideRef.current;
      const currentEl = slideRefs.current[currentIdx];

      if (currentEl) {
        const slideTop = currentEl.offsetTop;
        const slideBottom = slideTop + currentEl.offsetHeight;
        const viewTop = container.scrollTop;
        const viewBottom = viewTop + container.clientHeight;
        if (e.deltaY > 0 && viewBottom < slideBottom - 16) return;
        if (e.deltaY < 0 && viewTop > slideTop + 16) return;
      }

      const dir = e.deltaY > 0 ? 1 : -1;
      const nextIdx = currentIdx + dir;
      if (nextIdx < 0 || nextIdx >= HOME_SLIDES.length) return;

      e.preventDefault();
      if (wheelLockRef.current) return;

      wheelLockRef.current = true;
      scrollToSlide(nextIdx);
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 520);
    };

    const handleKeyDown = (e) => {
      if (window.innerWidth < 768) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToSlide(activeSlideRef.current + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSlide(activeSlideRef.current - 1);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, scrollToSlide]);

  const handleSelectTab = useCallback(
    (tabId) => {
      setActiveTab(tabId);
      if (typeof window !== 'undefined') {
        const nextHash = tabId === 'home' ? '' : `#${tabId}`;
        window.history.replaceState(null, '', nextHash || window.location.pathname);
        if (tabId === 'home') {
          setTimeout(() => scrollToSlide(0), 40);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    },
    [scrollToSlide]
  );

  const handleGoDownload = useCallback(() => {
    if (activeTab !== 'home') {
      setActiveTab('home');
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', window.location.pathname);
      }
      setTimeout(() => scrollToSlide(HOME_SLIDES.length - 1), 80);
    } else {
      scrollToSlide(HOME_SLIDES.length - 1);
    }
  }, [activeTab, scrollToSlide]);

  const primaryDownload = getPrimaryDownloadInfo(release, userOS);

  const altMacAsset =
    primaryDownload.os === 'macos'
      ? primaryDownload.asset === release?.macX64Asset
        ? release?.macArm64Asset
          ? { asset: release.macArm64Asset, label: 'Apple Silicon (.dmg)' }
          : null
        : release?.macX64Asset
          ? { asset: release.macX64Asset, label: 'Intel Mac (.dmg)' }
          : null
      : null;

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A] transition-colors duration-200 dark:bg-[#0F1420] dark:text-[#E6EAF2]">
      <AmbientBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onGoDownload={handleGoDownload}
          isDark={isDark}
          onToggleTheme={() => setIsDark((v) => !v)}
        />

        {activeTab === 'home' ? (
          <>
            <SlideIndicator
              slides={HOME_SLIDES}
              activeIndex={activeSlide}
              onSelect={scrollToSlide}
            />

            <main
              ref={snapContainerRef}
              className="penso-snap-container h-dvh overflow-y-auto scroll-smooth md:snap-y md:snap-mandatory"
            >
              {/* Slide 1: Hero + Interactive Editor Mockup together */}
              <section
                ref={(el) => {
                  slideRefs.current[0] = el;
                }}
                data-slide-index={0}
                id="hero"
                className="flex min-h-full snap-start flex-col items-center justify-center px-4 pb-6 pt-20 sm:px-6 lg:px-8"
              >
                <div className="mx-auto w-full max-w-6xl">
                  {/* Compact Hero Header */}
                  <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-2xl font-extrabold leading-[1.22] tracking-[-0.03em] text-zinc-950 dark:text-white sm:text-3xl lg:text-[38px]">
                      소설의 첫 문장부터 완결까지,{' '}
                      <span className="bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent dark:from-indigo-300 dark:to-sky-200">
                        이야기에만 집중하세요
                      </span>
                    </h1>

                    <p className="mx-auto mt-2.5 max-w-xl text-sm text-zinc-500 dark:text-zinc-400 sm:text-[15px]">
                      회원가입·구독료 없는 무료 웹소설 에디터, Penso.
                    </p>

                    {/* Primary & Secondary CTAs */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                      {primaryDownload.asset?.downloadUrl ? (
                        <a
                          href={primaryDownload.asset.downloadUrl}
                          download={primaryDownload.asset.name}
                          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 dark:bg-white dark:text-[#0A0B0E] dark:hover:bg-zinc-200"
                        >
                          <Download className="h-4 w-4" />
                          <span>
                            {primaryDownload.label}
                            {primaryDownload.os === 'macos'
                              ? ` (${primaryDownload.subLabel})`
                              : ''}
                          </span>
                        </a>
                      ) : loading ? (
                        <button
                          type="button"
                          disabled
                          className="inline-flex cursor-wait items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white opacity-80 dark:bg-white dark:text-[#0A0B0E]"
                        >
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>{primaryDownload.label}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => scrollToSlide(HOME_SLIDES.length - 1)}
                          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-[#0A0B0E] dark:hover:bg-zinc-200"
                        >
                          <Download className="h-4 w-4" />
                          <span>{primaryDownload.label}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => scrollToSlide(HOME_SLIDES.length - 1)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/60 px-4 py-2.5 text-sm font-semibold text-zinc-700 backdrop-blur-md transition-colors hover:bg-white/80 dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
                      >
                        <span>다른 OS</span>
                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                      </button>

                      {altMacAsset && (
                        <a
                          href={altMacAsset.asset.downloadUrl}
                          download={altMacAsset.asset.name}
                          className="inline-flex items-center gap-1 px-2 text-xs font-medium text-zinc-500 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-white"
                        >
                          <Download className="h-3.5 w-3.5" />
                          {altMacAsset.label}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Interactive Editor Preview right below in the same screen */}
                  <HeroMockup isDark={isDark} className="mt-5 sm:mt-6" />
                </div>
              </section>

              {/* Slide 2: Ownership & Security (Vertical 4 Pillars) */}
              <section
                ref={(el) => {
                  slideRefs.current[1] = el;
                }}
                data-slide-index={1}
                id="ownership"
                aria-labelledby="sync-heading"
                className="flex min-h-full snap-start flex-col items-center justify-center py-12"
              >
                <SyncSecuritySection />
              </section>

              {/* Slide 3: Writing Features */}
              <section
                ref={(el) => {
                  slideRefs.current[2] = el;
                }}
                data-slide-index={2}
                id="features"
                aria-labelledby="features-heading"
                className="flex min-h-full snap-start flex-col items-center justify-center py-12"
              >
                <FeaturesBento />
              </section>

              {/* Slide 4: Custom Widgets */}
              <section
                ref={(el) => {
                  slideRefs.current[3] = el;
                }}
                data-slide-index={3}
                id="widgets"
                aria-labelledby="widgets-heading"
                className="flex min-h-full snap-start flex-col items-center justify-center py-12"
              >
                <CustomWidgetsSection />
              </section>

              {/* Slide 5: Download + Footer */}
              <section
                ref={(el) => {
                  slideRefs.current[4] = el;
                }}
                data-slide-index={4}
                id="download"
                aria-labelledby="download-heading"
                className="flex min-h-full snap-start flex-col justify-between pt-12"
              >
                <div className="flex flex-1 items-center py-6">
                  <DownloadSection
                    release={release}
                    loading={loading}
                    error={error}
                    onRetry={retry}
                    userOS={userOS}
                  />
                </div>
                <Footer />
              </section>
            </main>
          </>
        ) : (
          <>
            <main className="flex-1 pt-16">
              {activeTab === 'guide' && <GuidePage />}
              {activeTab === 'community' && <CommunityPage />}
            </main>
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}
