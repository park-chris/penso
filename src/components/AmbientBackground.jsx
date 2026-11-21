const SPARKLES = [
  { top: '9%', left: '14%', size: 2, delay: '0s', duration: '4.8s' },
  { top: '16%', left: '32%', size: 1.5, delay: '1.3s', duration: '5.8s' },
  { top: '12%', left: '66%', size: 2, delay: '0.7s', duration: '5.2s' },
  { top: '10%', left: '84%', size: 1.5, delay: '2.9s', duration: '6.0s' },
  { top: '28%', left: '9%', size: 2, delay: '1.8s', duration: '5.5s' },
  { top: '31%', left: '89%', size: 1.5, delay: '2.2s', duration: '5.9s' },
  { top: '48%', left: '12%', size: 2, delay: '0.5s', duration: '6.4s' },
  { top: '52%', left: '86%', size: 2, delay: '3.1s', duration: '4.9s' },
  { top: '68%', left: '18%', size: 1.5, delay: '1.4s', duration: '5.7s' },
  { top: '72%', left: '78%', size: 2, delay: '2.5s', duration: '6.2s' },
  { top: '86%', left: '26%', size: 2, delay: '0.9s', duration: '5.3s' },
  { top: '88%', left: '68%', size: 1.5, delay: '2.0s', duration: '5.6s' },
];

export function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden [contain:strict]"
      aria-hidden="true"
    >
      {/* Pure CSS radial-gradient aura (zero GPU blur cost) */}
      <div
        className="absolute inset-0 opacity-100 dark:opacity-0"
        style={{
          backgroundImage:
            'radial-gradient(620px 340px at 50% 0%, rgba(14, 165, 233, 0.07), transparent 72%), radial-gradient(460px 360px at 92% 95%, rgba(99, 102, 241, 0.05), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100"
        style={{
          backgroundImage:
            'radial-gradient(680px 380px at 50% 0%, rgba(43, 88, 150, 0.22), transparent 72%), radial-gradient(480px 380px at 92% 95%, rgba(30, 63, 110, 0.18), transparent 70%)',
        }}
      />

      {/* Subtle twinkling starlight specks */}
      {SPARKLES.map((s, idx) => (
        <span
          key={idx}
          className="penso-sparkle absolute rounded-full bg-[#142A52]/25 will-change-[opacity,transform] dark:bg-white/80"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}
