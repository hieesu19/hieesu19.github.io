import { defineConfig } from 'astro/config';

// Change SITE_URL in GitHub Actions to your own GitHub Pages or custom domain.
// This template targets a *user site* repository named USERNAME.github.io.
export default defineConfig({
  site: process.env.SITE_URL || 'https://hieesu19.github.io',
  output: 'static',
  trailingSlash: 'always',
});
