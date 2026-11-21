const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function getHeaders(extra = {}) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...extra,
  };

  // Legacy anon keys (JWT) also use Authorization Bearer; new sb_publishable_ keys only use apikey
  if (SUPABASE_ANON_KEY.startsWith('eyJ')) {
    headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
  }

  return headers;
}

export async function fetchInquiries(signal) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const url = `${SUPABASE_URL}/rest/v1/inquiries?select=id,category,title,author,body,status,reply,created_at&order=created_at.desc&limit=50`;
  const res = await fetch(url, {
    headers: getHeaders(),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Supabase fetch failed (${res.status})`);
  }

  return res.json();
}

export async function createInquiry({ category, title, author, body }) {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const url = `${SUPABASE_URL}/rest/v1/inquiries`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify({
      category,
      title: title.trim(),
      author: author.trim(),
      body: body.trim(),
      status: '접수됨',
      reply: null,
    }),
  });

  if (!res.ok) {
    let message = '문의 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    try {
      const errData = await res.json();
      if (errData?.message) message = errData.message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  const rows = await res.json();
  return Array.isArray(rows) ? rows[0] : rows;
}
