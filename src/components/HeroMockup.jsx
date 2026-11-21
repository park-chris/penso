export function HeroMockup({ isDark = true, className = 'mt-6' }) {
  const wideSrc = isDark ? './preview-dark-wide.jpg' : './preview-light-wide.jpg';
  const narrowSrc = isDark ? './preview-dark-narrow.jpg' : './preview-light-narrow.jpg';

  return (
    <div className={`mx-auto w-full max-w-[460px] md:max-w-[840px] ${className}`}>
      <div className="overflow-hidden rounded-2xl shadow-[0_24px_70px_-24px_rgba(15,23,42,0.22)] dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.72)]">
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
