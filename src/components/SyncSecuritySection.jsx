import { Cloud, KeyRound, ShieldCheck, Wifi } from 'lucide-react';

const CORE_PILLARS = [
  {
    icon: Cloud,
    accent: 'text-sky-500 dark:text-sky-300',
    title: '기기 저장 & Google Drive',
    desc: '소중한 데이터를 내 기기와 구글 드라이브에 암호화 저장합니다.',
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
    desc: '번거로운 회원가입 없이 키 하나로 저장소를 생성하며, 키로 내 데이터를 암호화합니다.',
  },
  {
    icon: ShieldCheck,
    accent: 'text-violet-500 dark:text-violet-300',
    title: 'AI 학습 없음 · 내 AI 연결',
    desc: '원고를 수집·학습하지 않으며, 내가 쓰는 AI API를 사용합니다.',
  },
];

export function SyncSecuritySection() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-400">
          개발자도 볼 수 없는 암호화 자동 백업
        </p>
        <h2
          id="sync-heading"
          className="mt-2.5 text-3xl font-bold tracking-[-0.03em] text-zinc-900 dark:text-white sm:text-4xl"
        >
          작품의 소유권은 오직 작가에게
        </h2>
      </div>

      {/* 4 Items in a Single Horizontal Row (Clean Borderless Icon + Text Layout) */}
      <div className="mt-14 grid grid-cols-1 gap-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        {CORE_PILLARS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60 ring-1 ring-slate-200/80 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105 dark:bg-white/[0.04] dark:ring-white/[0.1]">
                <Icon className={`h-5 w-5 ${item.accent}`} />
              </div>
              <h3 className="mt-5 text-[15px] font-bold tracking-tight text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-[13px]">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
