export function SlideIndicator({ slides, activeIndex, onSelect }) {
  return (
    <nav
      aria-label="섹션 이동"
      className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2.5 md:flex lg:right-6"
    >
      {slides.map((slide, idx) => {
        const isActive = idx === activeIndex;
        return (
          <button
            key={slide.id}
            type="button"
            onClick={() => onSelect(idx)}
            aria-label={`${slide.label} 섹션으로 이동`}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center gap-2.5 py-0.5 focus:outline-none"
          >
            <span
              className={`pointer-events-none translate-x-1 text-[11px] font-medium tracking-tight opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 ${
                isActive
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              {slide.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? 'h-6 w-1.5 bg-zinc-900 shadow-[0_0_8px_rgba(24,24,27,0.3)] dark:bg-white dark:shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                  : 'h-1.5 w-1.5 bg-zinc-300 group-hover:bg-zinc-500 dark:bg-zinc-600 dark:group-hover:bg-zinc-300'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
