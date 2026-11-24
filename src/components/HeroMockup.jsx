export function HeroMockup({ isDark = true, className = '' }) {
  const wideSrc = isDark ? './preview-dark-wide.jpg' : './preview-light-wide.jpg';
  const narrowSrc = isDark ? './preview-dark-narrow.jpg' : './preview-light-narrow.jpg';

  return (
    <div className={`mx-auto w-full max-w-[460px] md:max-w-[860px] ${className}`}>
      <div className="overflow-hidden rounded-t-2xl shadow-[0_-10px_60px_-24px_rgba(15,23,42,0.2)] dark:shadow-[0_-12px_70px_-20px_rgba(0,0,0,0.75)]">
        <picture key={isDark ? 'dark' : 'light'}>
          <source media="(min-width: 768px)" srcSet={wideSrc} />
          <img
            src={narrowSrc}
            alt={`Penso 에디터 ${isDark ? '다크' : '라이트'} 모드 실행 화면`}
            fetchPriority="high"
            decoding="async"
            draggable="false"
            className="block h-auto w-full scale-[1.006] select-none"
          />
        </picture>
      </div>
    </div>
  );
}
