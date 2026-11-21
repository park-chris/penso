export function PensoLogo({ className = '', showSub = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[9px] shadow-xs ring-1 ring-[#142A52]/12 dark:ring-white/15">
        <img
          src="./penso-icon.png"
          alt="Penso"
          width={32}
          height={32}
          decoding="async"
          className="h-full w-full object-cover"
          draggable="false"
        />
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className="text-[19px] font-bold tracking-[-0.03em] text-[#121C2D] dark:text-[#F4F5F7]">
          Penso
        </span>
        {showSub && (
          <span className="text-xs font-medium text-[#6C7A90] dark:text-zinc-500">
            펜소
          </span>
        )}
      </span>
    </span>
  );
}
