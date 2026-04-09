import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://192.168.1.7:5119/openapi/v1.json',
  output: 'src/api/generated',
  plugins: ['@hey-api/client-axios', '@hey-api/sdk', '@hey-api/typescript', {
    name: '@tanstack/vue-query',
    queryOptions: true,
  }]
})