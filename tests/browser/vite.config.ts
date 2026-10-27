import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    root: fileURLToPath(new URL('../../', import.meta.url)),
    cacheDir: fileURLToPath(
        new URL('../../node_modules/.vite-checkout-tests', import.meta.url),
    ),
    plugins: [
        tailwindcss(),
        react({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('../../resources/js/', import.meta.url)),
        },
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom/client',
            'react/compiler-runtime',
            '@inertiajs/react',
            'lucide-react',
            'sonner',
        ],
        exclude: ['leaflet', 'react-leaflet'],
    },
    server: { host: '127.0.0.1', port: 5175, strictPort: true },
});
