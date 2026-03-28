import { defineBoot } from '#q-app/wrappers';
import type { AxiosError } from 'axios';
import { client } from 'src/api/generated/client.gen';
import { keycloak } from './keycloak';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(({app}) => {
  client.instance.interceptors.request.use(config => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  });

  client.instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        // await keycloak.login();
      }
      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$api = client.instance;
})
