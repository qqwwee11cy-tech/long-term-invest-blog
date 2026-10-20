// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 사이트 실제 주소 (도메인을 사면 바꿔주세요)
export default defineConfig({
  site: 'https://long-term-invest-blog.vercel.app',
  integrations: [mdx(), sitemap()],
});
