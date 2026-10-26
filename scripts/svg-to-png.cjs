// 글 속 SVG 그림을 쓰레드에 올릴 PNG로 바꿉니다 (쓰레드는 SVG를 못 올려요).
// 사용: node scripts/svg-to-png.cjs <svg 파일> <png 저장 경로>
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error('사용: node scripts/svg-to-png.cjs <svg> <png>'); process.exit(1); }
const font = path.join(__dirname, '../node_modules/@fontsource/noto-sans-kr');

(async () => {
  const svg = fs.readFileSync(src, 'utf8');
  const browser = await chromium.launch(fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
  // 480 너비 그림을 2.25배로 키워 1080 너비 PNG로 만듭니다.
  const page = await browser.newPage({ viewport: { width: 480, height: 480 }, deviceScaleFactor: 2.25 });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://${font}/400.css"><link rel="stylesheet" href="file://${font}/700.css">
<style>html,body{margin:0;background:#fff}svg{display:block;width:480px;height:auto;font-family:'Noto Sans KR',sans-serif}</style>
</head><body>${svg}</body></html>`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('svg').first().screenshot({ path: out });
  await browser.close();
  console.log(`저장했어요: ${out}`);
})();
