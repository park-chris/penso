import { Cloud, KeyRound, ShieldCheck, Wifi } from 'lucide-react';

const CORE_PILLARS = [
  {
    icon: Cloud,
    accent: 'text-sky-500 dark:text-sky-300',
    title: '로컬 저장 & Google Drive',
    desc: '내 기기에 먼저 저장하고, 원할 때 내 드라이브에 암호화 백업합니다.',
  },
  {
    icon: Wifi,
    accent: 'text-emerald-500 dark:text-emerald-300',
    title: '같은 네트워크 기기 간 통신',
    desc: '외부 서버 없이 같은 Wi-Fi 안의 PC·모바일끼리 직접 동기화합니다.',
  },
  {
    icon: KeyRound,
    accent: 'text-indigo-500 dark:text-indigo-300',
    title: 'Login Key 암호화 동기화',
    desc: '회원가입 없이 키 하나로 저장소 생성. 이 키는 개발자도 모릅니다.',
  },
  {
    icon: ShieldCheck,
    accent: 'text-violet-500 dark:text-violet-300',
    title: 'AI 학습 없음 · 내 AI 연결',
    desc: '원고를 수집·학습하지 않으며, 내가 쓰는 AI API만 직접 연결합니다.',
  },
];

export function SyncSecuritySection() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-400">
          Local-First
        </p>
        <h2
          id="sync-heading"
          className="mt-2.5 text-3xl font-bold tracking-[-0.03em] text-zinc-900 dark:text-white sm:text-4xl"
        >
          작품의 소유권은 오직 작가에게
        </h2>
        <p className="mt-2.5 text-sm text-zinc-500 dark:text-zinc-400">
          원고 수집·AI 학습 없는 로컬-퍼스트 구조
        </p>
      </div>

      {/* 4 Items in a Single Horizontal Row (Clean Borderless Icon + Text Layout) */}
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {CORE_PILLARS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group flex flex-col items-center text-center"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/60 ring-1 ring-slate-200/80 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105 dark:bg-white/[0.04] dark:ring-white/[0.1]">
                <Icon className={`h-5 w-5 ${item.accent}`} />
              </div>
              <h3 className="mt-4 text-[15px] font-bold tracking-tight text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-[13px]">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
