import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import clerk from '@clerk/astro';

export default defineConfig({
  integrations: [react(), tailwind(), clerk()],
  site: 'https://adminflow.ai',
});
