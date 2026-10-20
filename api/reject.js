// 메일의 "반려" 버튼. 고칠 점을 받아 GitHub 이슈로 남기면, 자동 글쓰기가 그 글을 다시 써서 새 메일을 보냅니다.
import { REPO, gh, readParams, validSlug, getPost, frontmatterValue, isDraft, keyMatches, page, esc } from './_lib.js';

export default async function handler(req, res) {
  const { slug, key, reason = '' } = readParams(req);
  if (!validSlug(slug)) return page(res, 400, '잘못된 링크', '<h1>링크가 올바르지 않아요</h1>');
  if (!process.env.GITHUB_TOKEN) return page(res, 500, '설정 필요', '<h1>아직 반려 기능 설정이 끝나지 않았어요</h1>');

  let post;
  try {
    post = await getPost(slug);
  } catch (e) {
    return page(res, 404, '글 없음', '<h1>이 글을 찾지 못했어요</h1>');
  }
  const title = frontmatterValue(post.text, 'title') || slug;
  if (!isDraft(post.text)) return page(res, 200, '이미 게시됨', `<h1>이미 게시된 글이라 반려할 수 없어요</h1><p>고칠 점은 프로젝트 스레드에 알려 주세요.</p>`);
  if (!keyMatches(post.text, key)) return page(res, 403, '확인 실패', '<h1>반려 링크가 맞지 않아요</h1><p>가장 최근에 받은 메일의 버튼을 눌러 주세요.</p>');

  if (req.method !== 'POST') {
    return page(res, 200, '반려', `<h1>이 글을 다시 쓸까요?</h1><p><b>${esc(title)}</b></p>
<form method="post"><input type="hidden" name="slug" value="${esc(slug)}"><input type="hidden" name="key" value="${esc(key)}">
<p>고칠 점을 적어 주세요. 비워 두면 구성과 설명을 새로 다듬어요.</p><textarea name="reason" maxlength="2000" placeholder="예: 너무 어려워요, 예시를 더 넣어 주세요"></textarea>
<button type="submit" class="gray">반려하고 다시 쓰기</button></form>`);
  }

  try {
    await gh(`/repos/${REPO}/issues`, {
      method: 'POST',
      body: JSON.stringify({
        title: `반려: ${slug}`,
        body: `글: ${title}\n파일: src/content/posts/${slug}.md\n\n고칠 점:\n${String(reason).slice(0, 2000) || '(적지 않음: 구성과 설명을 새로 다듬기)'}\n\n_메일의 반려 버튼으로 남긴 요청이에요. 자동 글쓰기가 다시 써서 새 승인 메일을 보내고 이 이슈를 닫아요._`,
      }),
    });
  } catch (e) {
    console.error(e);
    return page(res, 502, '실패', '<h1>반려를 남기지 못했어요</h1><p>잠시 뒤 다시 해 주세요.</p>');
  }
  return page(res, 200, '반려 완료', `<h1>반려했어요</h1><p>적어 주신 내용을 반영해 다시 쓴 뒤 새 승인 메일을 보내 드릴게요.</p>`);
}
