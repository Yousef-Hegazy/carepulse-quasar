import { defineBoot } from '#q-app/wrappers';
import type { AxiosError } from 'axios';
import { client } from 'src/api/generated/client.gen';
import { useAuthStore } from 'src/stores/auth';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(({ app, store, router }) => {
  client.instance.interceptors.request.use(config => {
    const authStore = useAuthStore(store);

    if (authStore?.auth?.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.auth.accessToken}`;
    }

    return config;
  });

  client.instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as typeof error.config & { _retry?: boolean };


      if (error.response?.status === 401 && !originalRequest?._retry && router.currentRoute.value.path !== '/') {
        originalRequest._retry = true;

        try {
          const authStore = useAuthStore(store);


          if (authStore) {
            await authStore.refresh({
              refreshToken: authStore.auth?.refreshToken || ''
            });

            return client.instance(originalRequest);
          }
        } catch (retryError) {
          router.replace('/');
          return Promise.reject(retryError as Error);
        }
      }

      return Promise.reject(error as Error);

    }
  );

  app.config.globalProperties.$api = client.instance;
})
