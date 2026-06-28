/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        open: true,
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    include: ['src/**/*.{test,spec}.{ts,tsx}'],
                    exclude: ['src/**/integration-tests/**'],
                },
            },
            {
                extends: true,
                test: {
                    name: 'integration',
                    include: ['src/**/integration-tests/**/*.{test,spec}.{ts,tsx}'],
                },
            },
        ],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/**/*.{test,spec}.{ts,tsx}',
                'src/**/integration-tests/fixtures.ts',
                'src/test/**',
            ],
        },
    },
});
