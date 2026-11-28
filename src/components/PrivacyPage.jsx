import { ArrowLeft } from 'lucide-react';
import { PRIVACY_POLICY_MD } from '../content/privacyPolicy';
import { MarkdownRenderer } from './MarkdownRenderer';

export function PrivacyPage({ onBack }) {
  return (
    <div className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-[#0F172A] dark:text-[#7D8BA1] dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>홈으로</span>
        </button>

        <MarkdownRenderer content={PRIVACY_POLICY_MD} />
      </article>
    </div>
  );
}
