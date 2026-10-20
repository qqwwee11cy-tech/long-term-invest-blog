// 메일의 "승인" 버튼. GET은 확인 화면(메일 앱의 링크 미리 열기로 잘못 게시되지 않게), POST에서 실제로 게시합니다.
import { REPO, gh, readParams, validSlug, getPost, frontmatterValue, isDraft, keyMatches, todayKST, page, esc } from './_lib.js';

export default async function handler(req, res) {
  const { slug, key } = readParams(req);
  if (!validSlug(slug)) return page(res, 400, '잘못된 링크', '<h1>링크가 올바르지 않아요</h1><p>메일의 버튼을 다시 눌러 주세요.</p>');
  if (!process.env.GITHUB_TOKEN) return page(res, 500, '설정 필요', '<h1>아직 승인 기능 설정이 끝나지 않았어요</h1><p>Vercel에 GITHUB_TOKEN을 넣어 주세요.</p>');

  let post;
  try {
    post = await getPost(slug);
  } catch (e) {
    return page(res, 404, '글 없음', '<h1>이 글을 찾지 못했어요</h1><p>이미 지워졌거나 주소가 바뀌었을 수 있어요.</p>');
  }
  const title = frontmatterValue(post.text, 'title') || slug;

  if (!isDraft(post.text)) {
    return page(res, 200, '이미 게시됨', `<h1>이미 게시된 글이에요</h1><p>${esc(title)}</p><a class="btn" href="/posts/${slug}/">블로그에서 보기</a>`);
  }
  if (!keyMatches(post.text, key)) {
    return page(res, 403, '확인 실패', '<h1>승인 링크가 맞지 않아요</h1><p>가장 최근에 받은 메일의 버튼을 눌러 주세요. 글을 다시 쓰면 링크가 바뀌어요.</p>');
  }

  if (req.method !== 'POST') {
    return page(res, 200, '게시 확인', `<h1>이 글을 블로그에 올릴까요?</h1><p><b>${esc(title)}</b></p>
<form method="post"><input type="hidden" name="slug" value="${esc(slug)}"><input type="hidden" name="key" value="${esc(key)}"><button type="submit">지금 올리기</button></form>
<a class="btn gray" href="/preview/${slug}/">미리보기 다시 보기</a>`);
  }

  const updated = post.text
    .replace(/^draft:\s*true\s*$/m, 'draft: false')
    .replace(/^approveHash:.*\n/m, '')
    .replace(/^pubDate:.*$/m, `pubDate: ${todayKST()}`);
  try {
    await gh(`/repos/${REPO}/contents/${post.path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `게시: ${title} (메일 승인)`,
        content: Buffer.from(updated, 'utf8').toString('base64'),
        sha: post.sha,
        branch: 'main',
      }),
    });
  } catch (e) {
    console.error(e);
    return page(res, 502, '게시 실패', '<h1>게시하지 못했어요</h1><p>잠시 뒤 다시 눌러 주세요. 계속 안 되면 프로젝트 스레드에 알려 주세요.</p>');
  }
  return page(res, 200, '게시 완료', `<h1>게시했어요 🎉</h1><p><b>${esc(title)}</b></p><p>사이트에 반영되기까지 1~2분 걸려요.</p><a class="btn" href="/posts/${slug}/">블로그에서 보기</a>`);
}
