# 자동 글쓰기와 게시 절차

예약된 자동 글쓰기는 이 절차를 따릅니다. 글은 Claude가 쓰고, **블로그 주인(긍정글귀)이 승인하면 Claude가 게시**합니다. 주인이 GitHub에서 직접 할 일은 없습니다.

1. `docs/writing-guide.md` 전체와 해당 카테고리 절을 읽고, 해당 주제 목록에서 체크되지 않은 첫 주제를 고릅니다 (주간 시장 정리는 목록 없음).
2. 웹 검색으로 사실을 확인하며 글과 SVG 그림을 만듭니다. 주제 목록에서 그 주제를 `[x]`로 바꿉니다.
3. 점검: 글 속 숫자를 출처와 다시 대조, 그래프 숫자와 본문 일치, 매수/매도 권유·목표주가·전망 표현 없음, 문장 베끼기 없음, frontmatter 확인, `npm install && npm run build` 통과, 가능하면 Playwright(executablePath `/opt/pw-browsers/chromium`)로 390px 너비 스크린샷 확인.
4. 새 브랜치 `post/<파일명>`으로 커밋·푸시하고 main 대상 PR을 엽니다. `subscribe_pr_activity`로 PR을 지켜봅니다. 미리보기 주소: `https://long-term-invest-blog-git-post-<파일명>-qqwwee11cy-4937.vercel.app/posts/<파일명>/`
5. 승인 요청
   - 이 스레드에 reply: 제목, 요약 2~3문장, 미리보기 링크, 그리고 "괜찮으면 여기에 '승인'이라고 보내주세요. 제가 바로 게시할게요. 고칠 점은 말로 적어주시면 반영할게요."
   - Gmail 도구(`mcp__Gmail__send_message`, ToolSearch로 불러오기)가 있으면 `qqwwee11.cy@gmail.com`으로 같은 내용 메일. 제목 `[천천히 부자되기] 새 글 승인 요청: 「제목」`. htmlBody는 흰 배경, 강조색 #1f7a4d, 최대 너비 520px 카드: 제목, 요약, "미리보기" 링크, 초록 버튼 "승인하러 가기"(https://claude.ai/code/project/chan_011qUpUbkHA69uwYG4pn34Xy), 작은 안내 "Claude 프로젝트에서 이 글의 대화를 열고 '승인'이라고 보내면 게시돼요." body에는 같은 내용을 일반 텍스트로. 메일을 못 보냈으면 스레드에 한 줄 적습니다.
   - 아직 게시되지 않은 이전 post/ PR이 있으면 "승인 대기 중인 글 N편"을 덧붙입니다.
6. 주인이 이 스레드에서 '승인'하면 PR을 squash 머지해 게시하고, 1~2분 뒤 게시된 글 링크를 알려줍니다. 수정 요청이면 반영해 다시 미리보기를 보여줍니다. 게시하지 말라고 하면 PR을 닫습니다. 주인의 승인 없이는 머지하지 않습니다.
