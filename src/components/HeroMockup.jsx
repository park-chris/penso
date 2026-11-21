export function HeroMockup({ className = 'mt-6' }) {
  return (
    <div className={`mx-auto w-full max-w-[460px] md:max-w-[840px] ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.22)] dark:border-white/[0.1] dark:bg-[#141B2B]/60 dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.72)]">
        <picture>
          <source media="(min-width: 768px)" srcSet="./preview-wide.png" />
          <img
            src="./preview-narrow.png"
            alt="Penso 에디터 실행 화면"
            fetchPriority="high"
            decoding="async"
            draggable="false"
            className="block h-auto w-full select-none"
          />
        </picture>
      </div>
    </div>
  );
}
