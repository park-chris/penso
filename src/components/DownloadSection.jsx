import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  Download,
  Laptop,
  Monitor,
  RefreshCw,
  ShieldAlert,
  Smartphone,
} from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

function OsDownloadDropdownCard({
  icon: Icon,
  title,
  subtitle,
  recommended,
  loading,
  error,
  onRetry,
  options,
  isOpen,
  onToggle,
}) {
  const availableOptions = options.filter((opt) => Boolean(opt.asset?.downloadUrl));

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl bg-white/60 p-6 backdrop-blur-md transition-colors dark:bg-white/[0.035] ${
        isOpen ? 'z-30' : 'z-0'
      } ${
        recommended
          ? 'border-2 border-[#142A52]/80 dark:border-white/30'
          : 'border border-slate-200/80 dark:border-white/[0.08]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 dark:bg-white/[0.07] dark:text-white">
            <Icon className="h-5 w-5" />
          </div>
          {recommended && (
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300">
              추천
            </span>
          )}
        </div>
        <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </div>

      {/* Dropdown Trigger & Menu */}
      <div className="relative mt-6">
        {loading ? (
          <button
            type="button"
            disabled
            className="inline-flex w-full cursor-wait items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400"
          >
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>버전 확인 중...</span>
          </button>
        ) : error ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.08]"
          >
            <RefreshCw className="h-4 w-4" />
            <span>다시 시도</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              className={`inline-flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                recommended
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-[#0A0B0E] dark:hover:bg-zinc-200'
                  : 'border border-zinc-200 bg-zinc-900 text-white hover:bg-zinc-800 dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-zinc-100 dark:hover:bg-white/[0.14]'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>{title} 다운로드</span>
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-slate-200/90 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl dark:border-white/[0.14] dark:bg-[#141B2B]/95">
                {availableOptions.length > 0 ? (
                  options.map((opt) =>
                    opt.asset?.downloadUrl ? (
                      <a
                        key={opt.key}
                        href={opt.asset.downloadUrl}
                        download={opt.asset.name}
                        onClick={onToggle}
                        className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-white/[0.07]"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                            {opt.label}
                          </div>
                          <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                            {opt.sub}
                            {opt.asset.size ? ` · ${opt.asset.size}` : ''}
                          </div>
                        </div>
                        <Download className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-400" />
                      </a>
                    ) : (
                      <div
                        key={opt.key}
                        className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 opacity-50"
                      >
                        <div>
                          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            {opt.label}
                          </div>
                          <div className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                            파일 준비 중
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="px-3 py-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
                    설치 파일 준비 중입니다.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function DownloadSection({
  release,
  loading,
  error,
  onRetry,
  userOS,
}) {
  const [openMenu, setOpenMenu] = useState(null); // 'windows' | 'macos' | null
  const containerRef = useRef(null);

  useEffect(() => {
    if (!openMenu) return undefined;
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [openMenu]);

  const isMac = userOS?.os === 'macos';
  const isWindows = !isMac;

  const androidUrl = SITE_CONFIG.ANDROID_APK_URL || release?.apkAsset?.downloadUrl || '';
  const androidFileName = release?.apkAsset?.name || undefined;

  const windowsOptions = [
    {
      key: 'win-installer',
      label: '설치 파일 (.exe)',
      sub: 'Windows 10 / 11 · 64-bit',
      asset: release?.installerAsset || null,
    },
    ...(release?.portableAsset
      ? [
          {
            key: 'win-portable',
            label: '포터블 버전 (.exe)',
            sub: '무설치 실행용',
            asset: release.portableAsset,
          },
        ]
      : []),
  ];

  const macOptions = [
    {
      key: 'mac-arm64',
      label: 'Apple Silicon (M1~M4)',
      sub: 'arm64.dmg',
      asset: release?.macArm64Asset || null,
    },
    {
      key: 'mac-x64',
      label: 'Intel Mac',
      sub: 'x64.dmg',
      asset: release?.macX64Asset || null,
    },
  ];

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-400">
            Download
          </p>
          <h2
            id="download-heading"
            className="mt-1.5 text-2xl font-bold tracking-[-0.03em] text-zinc-900 dark:text-white sm:text-3xl"
          >
            다운로드
          </h2>
        </div>

        {error && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.08]"
          >
            <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>릴리즈 다시 불러오기</span>
          </button>
        )}
      </div>

      {/* Single Row: Windows | macOS | Android & iOS (stacked vertically) */}
      <div className="relative z-20 mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <OsDownloadDropdownCard
          icon={Monitor}
          title="Windows"
          subtitle="Windows 10 / 11 (64-bit) · .exe"
          recommended={isWindows}
          loading={loading}
          error={error}
          onRetry={onRetry}
          options={windowsOptions}
          isOpen={openMenu === 'windows'}
          onToggle={() => setOpenMenu((prev) => (prev === 'windows' ? null : 'windows'))}
        />

        <OsDownloadDropdownCard
          icon={Laptop}
          title="macOS"
          subtitle="Apple Silicon (M1~M4) · Intel · .dmg"
          recommended={isMac}
          loading={loading}
          error={error}
          onRetry={onRetry}
          options={macOptions}
          isOpen={openMenu === 'macos'}
          onToggle={() => setOpenMenu((prev) => (prev === 'macos' ? null : 'macos'))}
        />

        {/* Right Column: Android & iOS stacked vertically */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-1 items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/60 px-5 py-4 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.035]">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-white/[0.07] dark:text-zinc-200">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Android</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Google Play 출시 예정</p>
              </div>
            </div>
            {androidUrl ? (
              <a
                href={androidUrl}
                download={androidFileName}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white/60 px-3 py-1.5 text-xs font-semibold text-zinc-800 backdrop-blur-sm hover:bg-white/80 dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
              >
                <Download className="h-3.5 w-3.5" />
                <span>APK</span>
              </a>
            ) : (
              <span className="shrink-0 rounded-full bg-slate-200/60 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400">
                준비 중
              </span>
            )}
          </div>

          <div className="flex flex-1 items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/60 px-5 py-4 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.035]">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-white/[0.07] dark:text-zinc-200">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">iOS</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">App Store 출시 예정</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-slate-200/60 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400">
              준비 중
            </span>
          </div>
        </div>
      </div>

      {/* Minimal Security Notice */}
      <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white/60 px-5 py-3 text-xs text-zinc-500 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-zinc-400 md:flex-row md:items-center md:justify-between">
        <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-200">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          최초 실행 시 보안 경고가 뜨면
        </span>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <span>
            <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Windows</strong>{' '}
            추가 정보 → 실행
          </span>
          <span className="hidden text-zinc-300 dark:text-zinc-700 sm:inline">·</span>
          <span>
            <strong className="font-semibold text-zinc-800 dark:text-zinc-200">macOS</strong>{' '}
            시스템 설정 → 개인정보 보호 및 보안 → 그대로 열기
          </span>
        </div>
      </div>
    </div>
  );
}
