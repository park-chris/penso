-- Penso 문의 게시판 테이블 + RLS 보안 정책 + 스팸 도배 방지 트리거
-- Supabase Dashboard > SQL Editor 에 그대로 붙여넣고 Run 하세요.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('question', 'bug', 'suggestion')),
  title text not null check (char_length(trim(title)) between 2 and 120),
  author text not null check (char_length(trim(author)) between 1 and 30),
  body text not null check (char_length(trim(body)) between 5 and 2000),
  status text not null default '접수됨' check (status in ('접수됨', '검토 중', '답변 완료')),
  reply text,
  created_at timestamptz not null default now()
);

-- 최신순 조회 성능용 인덱스
create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

-- 1) DB 레벨 스팸/도배 방지 트리거 (브라우저 우회 직접 API 호출도 차단)
create or replace function public.guard_inquiry_rate_limit()
returns trigger
language plpgsql
security definer
as $$
declare
  recent_10s int;
  recent_1h int;
begin
  -- 최근 10초 내 3건 이상 연속 등록 차단
  select count(*) into recent_10s
  from public.inquiries
  where created_at > now() - interval '10 seconds';

  if recent_10s >= 3 then
    raise exception '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.'
      using errcode = 'P0001';
  end if;

  -- 최근 1시간 내 40건 이상 대량 도배 차단
  select count(*) into recent_1h
  from public.inquiries
  where created_at > now() - interval '1 hour';

  if recent_1h >= 40 then
    raise exception '시간당 문의 등록 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_inquiry_rate_limit on public.inquiries;
create trigger trg_guard_inquiry_rate_limit
  before insert on public.inquiries
  for each row
  execute function public.guard_inquiry_rate_limit();

-- 2) RLS 보안 정책: 누구나 조회/새 글 작성만 가능, 수정/삭제 및 답변 조작 불가
alter table public.inquiries enable row level security;

drop policy if exists "Anyone can read inquiries" on public.inquiries;
create policy "Anyone can read inquiries"
  on public.inquiries
  for select
  using (true);

drop policy if exists "Anyone can insert inquiries" on public.inquiries;
create policy "Anyone can insert inquiries"
  on public.inquiries
  for insert
  with check (reply is null and status = '접수됨');
