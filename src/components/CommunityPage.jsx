import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, PenSquare, RefreshCw, X } from 'lucide-react';
import {
  createInquiry,
  fetchInquiries,
  isSupabaseConfigured,
} from '../lib/inquiriesApi';

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'question', label: '질문' },
  { id: 'bug', label: '버그' },
  { id: 'suggestion', label: '기능 제안' },
];

const WRITE_CATEGORIES = [
  { id: 'question', label: '질문' },
  { id: 'bug', label: '버그' },
  { id: 'suggestion', label: '기능 제안' },
];

const CATEGORY_LABEL = {
  question: '질문',
  bug: '버그',
  suggestion: '기능 제안',
};

const CATEGORY_TEXT = {
  question: 'text-sky-600 dark:text-sky-300',
  bug: 'text-rose-600 dark:text-rose-300',
  suggestion: 'text-indigo-600 dark:text-indigo-300',
};

const COOLDOWN_MS = 60 * 1000;
const COOLDOWN_KEY = 'penso-inquiry-last-submit';
const INQUIRY_CACHE_KEY = 'penso-inquiries-cache-v1';

function readCachedPosts() {
  try {
    const raw = sessionStorage.getItem(INQUIRY_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCachedPosts(list) {
  try {
    sessionStorage.setItem(INQUIRY_CACHE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

const MOCK_POSTS = [
  {
    id: 'mock-1',
    category: 'question',
    title: 'Login Key를 다른 PC에 입력했는데 바로 동기화되나요?',
    author: '새벽집필러',
    createdAt: '2026.11.21',
    status: '답변 완료',
    body: '집 데스크톱에서 쓰던 원고를 노트북에서도 이어 쓰고 싶습니다. Login Key만 입력하면 기존 폴더랑 설정집도 같이 넘어오나요?',
    reply:
      '네, 맞습니다! 같은 네트워크 내 기기 간 통신이 켜져 있거나 Google Drive 백업이 연결되어 있으면 동일한 Login Key 입력만으로 회차 폴더·설정집·마인드맵이 모두 복원됩니다.',
  },
  {
    id: 'mock-2',
    category: 'suggestion',
    title: '회차 내보내기할 때 문피아/노벨피아 규격 프리셋 추가 요청',
    author: '회귀장인',
    createdAt: '2026.11.20',
    status: '검토 중',
    body: '연재 플랫폼마다 줄바꿈이나 공백 포함 글자수 기준이 조금씩 달라서, 내보내기 시 플랫폼별 프리셋이 있으면 정말 편할 것 같습니다.',
    reply:
      '좋은 의견 감사합니다! 플랫폼별 줄바꿈·공백 기준 내보내기 프리셋을 다음 업데이트 후보에 올려두었습니다.',
  },
  {
    id: 'mock-3',
    category: 'bug',
    title: 'macOS Apple Silicon에서 최초 실행 시 보안 경고가 뜹니다',
    author: '맥북작가',
    createdAt: '2026.11.19',
    status: '답변 완료',
    body: 'arm64.dmg 설치 후 앱을 열면 확인되지 않은 개발자 경고가 표시됩니다. 어떻게 실행해야 하나요?',
    reply:
      '무료 독립 배포 앱 특성상 최초 1회 [시스템 설정] → [개인정보 보호 및 보안] 하단의 [그대로 열기]를 눌러주시면 이후에는 정상 실행됩니다.',
  },
];

function formatDate(iso) {
  if (!iso) return '';
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(iso)) return iso;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function normalizePost(row) {
  const replyText = (row.reply || '').trim() || null;
  const rawStatus = row.status || '접수됨';
  // Supabase에서 reply만 입력하고 status를 안 바꿔도 자동으로 '답변 완료' 표시
  const resolvedStatus = replyText && rawStatus === '접수됨' ? '답변 완료' : rawStatus;

  return {
    id: row.id,
    category: row.category || 'question',
    title: row.title || '',
    author: row.author || '익명',
    createdAt: formatDate(row.created_at || row.createdAt),
    status: resolvedStatus,
    body: row.body || '',
    reply: replyText,
  };
}

export function CommunityPage() {
  const configured = isSupabaseConfigured();
  const initialCached = configured ? readCachedPosts() : null;

  const [category, setCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [posts, setPosts] = useState(() =>
    configured ? initialCached || [] : MOCK_POSTS
  );
  const [loading, setLoading] = useState(configured && !initialCached);
  const [loadError, setLoadError] = useState(false);

  // Write modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formCategory, setFormCategory] = useState('question');
  const [formAuthor, setFormAuthor] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [honeypot, setHoneypot] = useState(''); // hidden bot trap
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!configured) return undefined;
    const controller = new AbortController();

    async function load() {
      try {
        const rows = await fetchInquiries(controller.signal);
        const normalized = Array.isArray(rows) ? rows.map(normalizePost) : [];
        setPosts(normalized);
        writeCachedPosts(normalized);
        setLoadError(false);
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (!readCachedPosts()) {
          setLoadError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [configured]);

  useEffect(() => {
    if (!modalOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape' && !submitting) setModalOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [modalOpen, submitting]);

  const filteredPosts =
    category === 'all'
      ? posts
      : posts.filter((p) => p.category === category);

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const resetForm = () => {
    setFormCategory('question');
    setFormAuthor('');
    setFormTitle('');
    setFormBody('');
    setHoneypot('');
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Honeypot triggered by automated bot -> silently close
    if (honeypot.trim()) {
      setModalOpen(false);
      resetForm();
      return;
    }

    const author = formAuthor.trim();
    const title = formTitle.trim();
    const body = formBody.trim();

    if (author.length < 1 || author.length > 30) {
      setFormError('닉네임은 1~30자로 입력해 주세요.');
      return;
    }
    if (title.length < 2 || title.length > 120) {
      setFormError('제목은 2~120자로 입력해 주세요.');
      return;
    }
    if (body.length < 5 || body.length > 2000) {
      setFormError('내용은 5~2000자로 입력해 주세요.');
      return;
    }

    // Client-side 60s cooldown
    try {
      const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
      const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 1000);
      if (remaining > 0) {
        setFormError(`도배 방지를 위해 ${remaining}초 후에 다시 작성할 수 있습니다.`);
        return;
      }
    } catch {
      // ignore storage errors
    }

    if (!configured) {
      setFormError('Supabase 연결(.env) 설정 후 실제 문의 등록이 활성화됩니다.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createInquiry({
        category: formCategory,
        title,
        author,
        body,
      });

      try {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      } catch {
        // ignore storage errors
      }

      const normalized = normalizePost(
        created || {
          id: `temp-${Date.now()}`,
          category: formCategory,
          title,
          author,
          body,
          status: '접수됨',
          reply: null,
          created_at: new Date().toISOString(),
        }
      );

      setPosts((prev) => {
        const next = [normalized, ...prev];
        writeCachedPosts(next);
        return next;
      });
      setExpandedId(normalized.id);
      setModalOpen(false);
      resetForm();
    } catch (err) {
      setFormError(err.message || '문의 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 pb-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#0F172A] dark:text-[#E6EAF2]">
              문의
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-[#9BA8BD]">
              사용 질문, 버그 제보, 기능 제안을 남겨주세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFormError('');
              setModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl bg-[#142A52] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0D1E3D] dark:bg-white dark:text-[#0F1420] dark:hover:bg-zinc-200 sm:self-auto"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span>문의하기</span>
          </button>
        </div>

        {/* Minimal Category Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#202A3E]">
          <div className="flex items-center gap-5">
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    setExpandedId(null);
                  }}
                  className={`relative pb-3 text-sm transition-colors ${
                    active
                      ? 'font-semibold text-[#0F172A] dark:text-white'
                      : 'font-medium text-slate-400 hover:text-slate-700 dark:text-[#7D8BA1] dark:hover:text-[#C5CEDD]'
                  }`}
                >
                  {cat.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#142A52] dark:bg-sky-300" />
                  )}
                </button>
              );
            })}
          </div>

          {!configured && (
            <span className="pb-3 text-[11px] text-slate-400 dark:text-[#7D8BA1]">
              미리보기
            </span>
          )}
        </div>

        {/* Clean Borderless Accordion List */}
        {loading ? (
          <ul
            aria-label="문의 목록 불러오는 중"
            className="divide-y divide-slate-200/80 dark:divide-[#202A3E]"
          >
            {[0, 1, 2, 3].map((i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-4 py-4 animate-pulse"
              >
                <div className="flex flex-1 items-center gap-3">
                  <span className="h-3.5 w-10 rounded bg-slate-200/80 dark:bg-white/[0.07]" />
                  <span
                    className="h-4 rounded bg-slate-200/80 dark:bg-white/[0.07]"
                    style={{ width: `${52 - i * 7}%` }}
                  />
                </div>
                <div className="hidden items-center gap-3 sm:flex">
                  <span className="h-3.5 w-12 rounded bg-slate-200/70 dark:bg-white/[0.06]" />
                  <span className="h-3.5 w-16 rounded bg-slate-200/70 dark:bg-white/[0.06]" />
                </div>
              </li>
            ))}
          </ul>
        ) : loadError ? (
          <div className="py-16 text-center text-sm text-slate-500 dark:text-[#9BA8BD]">
            문의 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="penso-fade-in py-16 text-center text-sm text-slate-500 dark:text-[#9BA8BD]">
            아직 등록된 문의가 없습니다.
          </div>
        ) : (
          <ul className="penso-fade-in divide-y divide-slate-200/80 dark:divide-[#202A3E]">
            {filteredPosts.map((post) => {
              const isOpen = expandedId === post.id;
              return (
                <li key={post.id}>
                  <button
                    type="button"
                    onClick={() => handleToggle(post.id)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-4 py-4 text-left transition-colors"
                  >
                    <div className="flex min-w-0 flex-1 items-baseline gap-3">
                      <span
                        className={`w-12 shrink-0 text-xs font-semibold ${
                          CATEGORY_TEXT[post.category] || 'text-slate-500'
                        }`}
                      >
                        {CATEGORY_LABEL[post.category] || post.category}
                      </span>
                      <span className="truncate text-sm font-medium text-[#0F172A] group-hover:text-[#142A52] dark:text-[#E6EAF2] dark:group-hover:text-white sm:text-[15px]">
                        {post.title}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-xs">
                      <span className="hidden text-slate-500 dark:text-[#8C9AB0] sm:inline">
                        {post.author}
                      </span>
                      <span
                        className={`hidden sm:inline-flex items-center gap-1 ${
                          post.status === '답변 완료'
                            ? 'rounded-full bg-emerald-500/12 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300'
                            : 'text-slate-400 dark:text-[#7D8BA1]'
                        }`}
                      >
                        {post.status === '답변 완료' && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {post.status}
                      </span>
                      <span className="hidden text-slate-400 dark:text-[#6B7990] md:inline">
                        {post.createdAt}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 dark:text-[#7D8BA1] ${
                          isOpen ? 'rotate-180 text-[#0F172A] dark:text-white' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pb-6 pl-0 pt-1 sm:pl-[60px]">
                      <div className="mb-2 text-xs text-slate-400 dark:text-[#7D8BA1] sm:hidden">
                        {post.author} · {post.status} · {post.createdAt}
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-[1.8] text-slate-600 dark:text-[#B5C0D2]">
                        {post.body}
                      </p>

                      {post.reply && (
                        <div className="mt-5 rounded-r-xl border-l-2 border-[#142A52] bg-[#142A52]/[0.05] px-4 py-3.5 backdrop-blur-xs dark:border-sky-400 dark:bg-sky-400/[0.08]">
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142A52] dark:text-sky-300">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Penso 답변</span>
                          </div>
                          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-[1.8] text-[#0F172A] dark:text-[#E6EAF2]">
                            {post.reply}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Write Inquiry Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
          onClick={() => {
            if (!submitting) setModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-white/[0.12] dark:bg-[#141B2B]/85"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2
                id="inquiry-modal-title"
                className="text-base font-bold text-[#0F172A] dark:text-[#E6EAF2]"
              >
                문의하기
              </h2>
              <button
                type="button"
                onClick={() => {
                  if (!submitting) setModalOpen(false);
                }}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-white/[0.08] dark:hover:text-white"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6 pt-1">
              {/* Honeypot hidden field for bots */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              {/* Category selector */}
              <div className="flex items-center gap-2">
                {WRITE_CATEGORIES.map((cat) => {
                  const active = formCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormCategory(cat.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        active
                          ? 'bg-[#142A52] text-white dark:bg-white dark:text-[#0F1420]'
                          : 'border border-slate-200/80 bg-white/50 text-slate-600 hover:bg-white/80 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.08]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Author */}
              <div>
                <input
                  type="text"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  placeholder="닉네임"
                  maxLength={30}
                  required
                  className="w-full rounded-xl border border-slate-200/90 bg-white/60 px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#142A52] focus:outline-none dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-[#E6EAF2] dark:placeholder:text-[#6B7990] dark:focus:border-sky-400/60"
                />
              </div>

              {/* Title */}
              <div>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="제목"
                  maxLength={120}
                  required
                  className="w-full rounded-xl border border-slate-200/90 bg-white/60 px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#142A52] focus:outline-none dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-[#E6EAF2] dark:placeholder:text-[#6B7990] dark:focus:border-sky-400/60"
                />
              </div>

              {/* Body */}
              <div>
                <textarea
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="문의 내용을 자세히 적어주세요. (최소 5자)"
                  rows={5}
                  maxLength={2000}
                  required
                  className="penso-scroll w-full resize-none rounded-xl border border-slate-200/90 bg-white/60 px-3.5 py-2.5 text-sm leading-relaxed text-[#0F172A] placeholder:text-slate-400 focus:border-[#142A52] focus:outline-none dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-[#E6EAF2] dark:placeholder:text-[#6B7990] dark:focus:border-sky-400/60"
                />
              </div>

              {formError && (
                <p className="text-xs font-medium text-rose-500 dark:text-rose-400">
                  {formError}
                </p>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#142A52] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0D1E3D] disabled:opacity-60 dark:bg-white dark:text-[#0F1420] dark:hover:bg-zinc-200"
                >
                  {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{submitting ? '등록 중...' : '등록하기'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
