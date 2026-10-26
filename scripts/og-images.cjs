// 글마다 링크 미리보기 이미지(1200x630 PNG)를 public/og/<글 파일명>.png 로 만듭니다.
// 사용: node scripts/og-images.cjs          (없는 것만 새로 만듦)
//       node scripts/og-images.cjs --force  (모두 다시 만듦)
// 쓰레드·카카오톡·페이스북은 SVG 미리보기를 못 읽어서 PNG로 만듭니다.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const postsDir = path.join(root, 'src/content/posts');
const outDir = path.join(root, 'public/og');
const fontCss = path.join(root, 'node_modules/@fontsource/noto-sans-kr');
const force = process.argv.includes('--force');

const CATEGORY = { guide: '장기 투자 정보', analysis: '기업·ETF 분석', news: '주간 시장 정리' };
const SITE = '천천히 부자되기';

function frontmatter(file) {
  const src = fs.readFileSync(file, 'utf8');
  const fm = src.split('---')[1] || '';
  const get = (k) => {
    const m = fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : '';
  };
  return { title: get('title'), category: get('category'), draft: get('draft') === 'true' };
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function html({ title, label }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://${fontCss}/400.css">
<link rel="stylesheet" href="file://${fontCss}/700.css">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #fbfaf7; font-family: 'Noto Sans KR', sans-serif; color: #1f2328; }
  .wrap { position: absolute; inset: 0; padding: 72px 88px; display: flex; flex-direction: column; }
  .bar { position: absolute; left: 0; top: 0; bottom: 0; width: 20px; background: #1f7a4d; }
  .label { font-size: 34px; font-weight: 700; color: #1f7a4d; }
  .title { margin-top: 28px; font-size: 76px; line-height: 1.28; font-weight: 700; word-break: keep-all; }
  .site { margin-top: auto; font-size: 32px; color: #5b6370; }
</style></head><body><div class="bar"></div><div class="wrap">
<div class="label">${esc(label)}</div><div class="title" id="t">${esc(title)}</div><div class="site">${SITE}</div>
</div></body></html>`;
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const jobs = [{ slug: 'default', title: '장기 투자 정보와 기업·ETF 분석', label: SITE }];
  for (const f of fs.readdirSync(postsDir)) {
    if (!/\.mdx?$/.test(f)) continue;
    const { title, category, draft } = frontmatter(path.join(postsDir, f));
    if (draft || !title) continue;
    jobs.push({ slug: f.replace(/\.mdx?$/, ''), title, label: CATEGORY[category] || SITE });
  }
  const browser = await chromium.launch(fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  let made = 0;
  for (const job of jobs) {
    const out = path.join(outDir, `${job.slug}.png`);
    if (!force && fs.existsSync(out)) continue;
    await page.setContent(html(job), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // 제목이 길면 세 줄 안에 들어갈 때까지 글자를 줄입니다.
    await page.evaluate(() => {
      const t = document.getElementById('t');
      let size = 76;
      while (t.scrollHeight > size * 1.28 * 3 + 2 && size > 48) { size -= 4; t.style.fontSize = size + 'px'; }
    });
    await page.screenshot({ path: out });
    made++;
  }
  await browser.close();
  console.log(`미리보기 이미지 ${made}개를 만들었어요 (public/og/)`);
})();
