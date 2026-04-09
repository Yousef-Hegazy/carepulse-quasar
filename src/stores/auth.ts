import { acceptHMRUpdate, defineStore } from 'pinia';
import { getApiPatientsProfile, postApiAuthLogin, postApiAuthRefresh, postApiAuthRegister, type AccessTokenResponse, type LoginRequest, type PatientResponse, type RefreshRequest, type RegisterRequest } from 'src/api/generated';

export interface AuthState {
  user: PatientResponse | null;
  auth: AccessTokenResponse | null;
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    user: null,
    auth: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.auth?.accessToken
  },
  actions: {
    setUser(user: AuthState['user']) {
      this.user = user;
    },
    setAuth(auth: AuthState['auth']) {
      this.auth = auth;
    },
    async login(request: LoginRequest) {
      try {
        const res = await postApiAuthLogin({
          body: request
        });

        this.auth = res.data || null;
      } catch (error) {
        console.log({ error });

        this.auth = null;

        throw error;
      }

      return this.auth;

    },
    async register(request: RegisterRequest) {
      try {
        const res = await postApiAuthRegister({
          body: request
        });



        if (res.status === 200) {
          return this.login({
            email: request.email,
            password: request.password
          });
        } else if (res.error) {
          if (res.error.errors) {
            throw new Error(Object.values(res.error.errors).flat().join(' '));
          }

        }

      } catch (error) {
        console.log({ error });

        this.auth = null;
        throw error;
      }

      return this.auth;
    },
    logout() {
      this.auth = null;
    },
    async refresh(request: RefreshRequest) {
      try {
        const res = await postApiAuthRefresh({
          body: request
        });

        this.auth = res.data || null;
      } catch (error) {
        console.log({ error });

        this.auth = null;
        throw error;
      }

      return this.auth;
    },
    async getUserProfile() {
      if (!this.auth?.accessToken) {
        this.user = null;
        return null;
      }

      try {
        const res = await getApiPatientsProfile();
        this.user = res.data || null;
        return this.user;

      } catch (error) {
        console.log({ error });

        this.user = null;
        throw error;
      }
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
