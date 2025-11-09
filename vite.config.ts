import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const allowedHosts = env.VITE_ALLOWED_HOSTS
    ? env.VITE_ALLOWED_HOSTS.split(',').map((host) => host.trim())
    : ['localhost', '127.0.0.1', '0.0.0.0'];

  return {
    plugins: [tailwindcss(), sveltekit()],
    fs: { allow: ['shared', 'src'] },
    server: {
      allowedHosts: allowedHosts
    }
  };
});
