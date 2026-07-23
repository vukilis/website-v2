import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';
import tailwindcss from '@tailwindcss/vite';

function rehypeLazyImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && !node.properties.loading) {
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
      }
    });
  };
}

export default defineConfig({
  site: 'https://kpab.github.io',
  trailingSlash: 'always',

  markdown: {
    processor: unified({
      remarkPlugins: [[remarkToc, { heading: 'contents' }]],
      rehypePlugins: [rehypeSlug, rehypeLazyImages, [rehypeAutolinkHeadings, { behavior: 'append' }]],
    }),
  },

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});