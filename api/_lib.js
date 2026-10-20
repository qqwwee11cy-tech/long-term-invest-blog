// 메일 승인·반려 버튼이 쓰는 공용 함수 (Vercel Functions)
// 필요한 환경 변수: GITHUB_TOKEN (이 저장소만, Contents·Issues 읽기/쓰기 권한)
import { createHash, timingSafeEqual } from 'node:crypto';

export const REPO = 'qqwwee11cy-tech/long-term-invest-blog';
const API = 'https://api.github.com';

export async function gh(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'long-term-invest-blog-approve',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  return res.json();
}

export function readParams(req) {
  let body = req.body || {};
  if (typeof body === 'string') body = Object.fromEntries(new URLSearchParams(body));
  return { ...(req.query || {}), ...body };
}

export function validSlug(slug) {
  return typeof slug === 'string' && /^[a-z0-9][a-z0-9-]{0,80}$/.test(slug);
}

export async function getPost(slug) {
  const path = `src/content/posts/${slug}.md`;
  const file = await gh(`/repos/${REPO}/contents/${path}?ref=main`);
  const text = Buffer.from(file.content, 'base64').toString('utf8');
  return { path, sha: file.sha, text };
}

export function frontmatterValue(text, key) {
  const m = text.match(new RegExp(`^${key}:\\s*['"]?(.*?)['"]?\\s*$`, 'm'));
  return m ? m[1] : '';
}

export function isDraft(text) {
  return /^draft:\s*true\s*$/m.test(text);
}

export function keyMatches(text, key) {
  const stored = frontmatterValue(text, 'approveHash');
  if (!stored || typeof key !== 'string' || !key) return false;
  const given = createHash('sha256').update(key).digest('hex');
  const a = Buffer.from(stored);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function todayKST() {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export { esc };

export function page(res, status, title, inner) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.end(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)}</title>
<style>body{margin:0;background:#fbfaf7;color:#1f2328;font-family:-apple-system,'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif}
.card{max-width:520px;margin:40px auto;background:#fff;border:1px solid #e5e2da;border-radius:14px;padding:24px}
h1{font-size:21px;margin:0 0 12px}p{line-height:1.6;color:#3a4048}
button,.btn{display:block;width:100%;box-sizing:border-box;text-align:center;padding:15px 0;border:0;border-radius:10px;font-size:18px;font-weight:700;color:#fff;background:#1f7a4d;text-decoration:none;margin-top:16px}
.gray{background:#8a929c}textarea{width:100%;box-sizing:border-box;min-height:120px;font-size:16px;padding:10px;border:1px solid #cfd3d8;border-radius:8px}
a{color:#1f7a4d}</style></head><body><div class="card">${inner}</div></body></html>`);
}
