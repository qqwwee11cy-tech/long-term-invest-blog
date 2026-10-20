# 천천히 부자되기

장기 투자 기록과 정보를 나누는 블로그입니다. [Astro](https://astro.build)로 만든 정적 사이트입니다.

## 글 쓰기

`src/content/posts/` 안에 마크다운 파일(`.md`)을 하나 만들면 글이 됩니다. 파일 이름이 주소가 됩니다 (`my-post.md` → `/posts/my-post/`).

```md
---
title: '글 제목'
description: '목록과 검색 결과에 보일 한 줄 요약'
pubDate: 2026-10-20
category: journal   # journal(내 투자 기록) 또는 guide(장기 투자 정보)
tags: ['ETF', '배당']
draft: false        # true면 사이트에 보이지 않습니다
---

본문을 여기에 씁니다.
```

## 로컬에서 실행

```sh
npm install
npm run dev     # http://localhost:4321
npm run build   # dist/ 에 사이트 생성
```

## 배포

Vercel 또는 Cloudflare Pages에서 이 저장소를 연결하면 자동으로 배포됩니다 (빌드 명령 `npm run build`, 출력 폴더 `dist`).
배포 후 `astro.config.mjs`의 `site` 값을 실제 주소로 바꿔주세요.
