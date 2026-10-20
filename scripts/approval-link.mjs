// 초안 글에 승인 키를 새로 만들고, 메일에 넣을 미리보기·승인·반려 주소를 출력합니다.
// 사용: node scripts/approval-link.mjs <글파일명(확장자 없이)>
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes, createHash } from 'node:crypto';

const SITE = 'https://long-term-invest-blog.vercel.app';
const slug = process.argv[2];
if (!slug) { console.error('글 파일명을 넣어 주세요'); process.exit(1); }
const path = `src/content/posts/${slug}.md`;
let text = readFileSync(path, 'utf8');
const key = randomBytes(24).toString('base64url');
const hash = createHash('sha256').update(key).digest('hex');

if (!/^draft:\s*true\s*$/m.test(text)) {
  text = /^draft:.*$/m.test(text) ? text.replace(/^draft:.*$/m, 'draft: true') : text.replace(/^---\n/, '---\ndraft: true\n');
}
text = /^approveHash:.*$/m.test(text) ? text.replace(/^approveHash:.*$/m, `approveHash: '${hash}'`) : text.replace(/^draft: true$/m, `draft: true\napproveHash: '${hash}'`);
writeFileSync(path, text);

const q = `slug=${slug}&key=${key}`;
console.log(JSON.stringify({
  preview: `${SITE}/preview/${slug}/`,
  approve: `${SITE}/api/approve?${q}`,
  reject: `${SITE}/api/reject?${q}`,
}, null, 2));
