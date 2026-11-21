import { Coffee } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export function Footer() {
  return (
    <footer className="w-full bg-transparent">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-6 text-xs text-zinc-500 sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} Penso. All rights reserved.</span>
        {SITE_CONFIG.BUY_ME_A_COFFEE_URL && (
          <>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <a
              href={SITE_CONFIG.BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <Coffee className="h-3.5 w-3.5 text-amber-500 dark:text-amber-300" />
              <span>후원하기</span>
            </a>
          </>
        )}
      </div>
    </footer>
  );
}
