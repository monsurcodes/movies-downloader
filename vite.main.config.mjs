import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        // ...other build options...
        rollupOptions: {
            external: ['bufferutil', 'utf-8-validate'],
            // ...your rollup options...
            // If using external, make sure selenium-webdriver is not excluded!
        },
        commonjsOptions: {
            dynamicRequireTargets: [
                'node_modules/selenium-webdriver/lib/atoms/*.js'
            ]
        },
    },
});
