import {
  BarChart3,
  BookOpen,
  Flag,
  ListChecks,
  SearchCheck,
  Sparkles,
  StickyNote,
  Timer,
  Type,
} from 'lucide-react';

const WIDGET_TILES = [
  { icon: StickyNote, title: '빠른 메모', sub: '아이디어 즉시 기록' },
  { icon: BookOpen, title: '문서 참조', sub: '설정·회차 고정 비교' },
  { icon: BarChart3, title: '집필 통계', sub: '글자 수·일일 목표' },
  { icon: Type, title: '특수문자', sub: '「」 『』 빠른 입력' },
  { icon: Flag, title: '복선 체크', sub: '미회수·회수 한눈에' },
  { icon: Timer, title: '집필 타이머', sub: '25분·50분 집중' },
  { icon: SearchCheck, title: '퇴고 분석', sub: '대사 비율·반복 어미' },
  { icon: Sparkles, title: '작명기', sub: '현대·판타지·무협' },
  { icon: ListChecks, title: '체크리스트', sub: '회차별 할 일 관리' },
];

export function CustomWidgetsSection() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-400">
          Widgets
        </p>
        <h2
          id="widgets-heading"
          className="mt-2.5 text-3xl font-bold tracking-[-0.03em] text-zinc-900 dark:text-white sm:text-4xl"
        >
          커스텀 위젯
        </h2>
        <p className="mt-2.5 text-sm text-zinc-500 dark:text-zinc-400">
          드래그로 순서를 바꾸고, 필요한 위젯만 좌·우에 자유롭게 배치하세요.
        </p>
      </div>

      {/* Centered 3x3 1:1 Square Monochrome Checkerboard */}
      <div className="mx-auto mt-10 w-full max-w-[490px]">
        <div className="grid grid-cols-3 gap-3.5">
          {WIDGET_TILES.map((item, idx) => {
            const Icon = item.icon;
            const isAlt = idx % 2 === 1;
            return (
              <div
                key={item.title}
                className={`group flex aspect-square flex-col items-center justify-center rounded-2xl border p-3 text-center backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 ${
                  isAlt
                    ? 'border-slate-200/70 bg-white/45 hover:bg-white/70 dark:border-white/[0.07] dark:bg-white/[0.02] dark:hover:bg-white/[0.05]'
                    : 'border-slate-200/90 bg-white/70 hover:bg-white/85 dark:border-white/[0.1] dark:bg-white/[0.045] dark:hover:bg-white/[0.07]'
                }`}
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/80 text-zinc-700 transition-transform duration-200 group-hover:scale-105 dark:bg-white/[0.06] dark:text-zinc-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-xs font-bold tracking-tight text-zinc-900 dark:text-white sm:text-sm">
                  {item.title}
                </h3>
                <p className="mt-1 hidden text-[11px] leading-snug text-zinc-500 dark:text-zinc-400 sm:block">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
