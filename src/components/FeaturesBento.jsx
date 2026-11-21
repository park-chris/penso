import {
  BookOpen,
  FolderTree,
  GitBranch,
  LayoutGrid,
  Moon,
  Sparkles,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-400/12 dark:text-amber-300',
    title: '설정집 위키 & 멀티 마인드맵',
    desc: '인물·세계관 위키와 여러 개의 관계도 보드를 한곳에서 관리합니다.',
  },
  {
    icon: GitBranch,
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/12 dark:text-emerald-300',
    title: '플롯 · 복선 · 인물 하이라이트',
    desc: '회차별 플롯과 복선을 연결하고 본문 속 등장인물을 자동 강조합니다.',
  },
  {
    icon: FolderTree,
    iconBg: 'bg-sky-50 text-sky-600 dark:bg-sky-400/12 dark:text-sky-300',
    title: '세부 폴더로 나누어보세요',
    desc: '부·편·회차·설정 문서를 원하는 계층 폴더로 깔끔하게 정리합니다.',
  },
  {
    icon: LayoutGrid,
    iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-400/12 dark:text-indigo-300',
    title: '커스텀 위젯',
    desc: '메모·집필 통계·특수문자 패드·복선·뽀모도로를 원하는 위치에 배치합니다.',
  },
  {
    icon: Sparkles,
    iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-400/12 dark:text-violet-300',
    title: 'AI 퇴고 · 문체 보조',
    desc: '내가 쓰는 AI를 연결해 문체 변환과 비문 다듬기를 바로 비교합니다.',
  },
  {
    icon: Moon,
    iconBg: 'bg-zinc-100 text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-200',
    title: '다크 모드 지원',
    desc: '야간 집필에도 눈부심이 적은 매트 차콜 다크 테마를 제공합니다.',
  },
];

export function FeaturesBento() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-400">
          Features
        </p>
        <h2
          id="features-heading"
          className="mt-2.5 text-3xl font-bold tracking-[-0.03em] text-zinc-900 dark:text-white sm:text-4xl"
        >
          집필에 필요한 기능
        </h2>
      </div>

      {/* 3x2 Feature Cards */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white/60 p-5 backdrop-blur-md transition-colors hover:border-slate-300/90 hover:bg-white/75 dark:border-white/[0.08] dark:bg-white/[0.035] dark:hover:border-white/[0.16] dark:hover:bg-white/[0.055]"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <h3 className="mt-4 text-[15px] font-bold tracking-tight text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-[13px]">
                {item.desc}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
