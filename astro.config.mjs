// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 배포 후 실제 주소로 바꿔주세요 (예: https://my-blog.vercel.app)
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap()],
});
