import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:5119/openapi/v1.json',
  output: 'src/api/generated',
  plugins: ['@hey-api/client-axios', '@hey-api/typescript', {
    name: '@tanstack/vue-query',
    queryOptions: true,
  }]
})