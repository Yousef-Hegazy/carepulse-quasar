import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8080/q/openapi',
  output: 'src/api/generated',
  plugins: ['@hey-api/client-axios', '@hey-api/typescript', {
    name: '@tanstack/vue-query',
    queryOptions: true,
  }]
})