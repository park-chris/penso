import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: '정말 무료인가요?',
    a: '네, 모든 핵심 집필·설정집·마인드맵·동기화 기능이 무료입니다. AI 퇴고 기능만 본인 API 키를 연결해 사용합니다.',
  },
  {
    q: '원고는 어디에 저장되나요?',
    a: '작가님의 기기 내부에 우선 저장되며, 원할 경우 개인 Google Drive에 종단간 암호화(E2EE)로 백업할 수 있습니다.',
  },
  {
    q: 'PC와 모바일 동기화는 어떻게 하나요?',
    a: '앱에서 생성된 고유 Login Key를 다른 기기에 입력하면 회원가입 없이 P2P 암호화 동기화가 연결됩니다.',
  },
  {
    q: '업데이트는 어떻게 받나요?',
    a: 'Windows(.exe) · macOS(.dmg) 설치 버전은 앱 내 알림으로 간편하게 업데이트하거나, 홈의 다운로드 섹션에서 최신 파일을 바로 받을 수 있습니다.',
  },
];

export function FaqSection({ compact = false }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className={
        compact
          ? 'mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'
          : 'scroll-mt-20 border-t border-zinc-200/70 bg-[#F6F7F9]/60 py-16 dark:border-zinc-800/70 dark:bg-[#17191C] sm:py-20'
      }
      aria-labelledby="faq-heading"
    >
      <div className={compact ? '' : 'mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'}>
        <h2
          id="faq-heading"
          className={
            compact
              ? 'text-xl font-bold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50'
              : 'text-center text-2xl font-bold tracking-[-0.03em] text-zinc-900 dark:text-zinc-50 sm:text-3xl'
          }
        >
          자주 묻는 질문
        </h2>

        <div className="mt-6 divide-y divide-zinc-200/80 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-[#1B1D20]">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:text-base">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
