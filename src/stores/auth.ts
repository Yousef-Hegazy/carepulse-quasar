import type Keycloak from 'keycloak-js';
import type { KeycloakLoginOptions, KeycloakLogoutOptions, KeycloakTokenParsed } from 'keycloak-js';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { markRaw } from 'vue';

interface AuthState {
  instance: Keycloak | undefined;
  isAuthenticated: boolean;
  profile: KeycloakTokenParsed | undefined;
  token: string | undefined;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    instance: undefined,
    isAuthenticated: false,
    profile: undefined,
    token: undefined
  }),
  getters: {
    username: (state) => state.profile?.preferred_username || null,
    userRoles: (state) => state.instance?.realmAccess?.roles || []
  },
  actions: {
    initialize(keycloakInstance: Keycloak, authenticated: boolean) {
      this.instance = markRaw(keycloakInstance)
      this.isAuthenticated = authenticated
      this.token = keycloakInstance.token
      this.profile = keycloakInstance.tokenParsed
    },

    async login(options?: KeycloakLoginOptions) {
      await this.instance?.login(options)
    },

    async logout(options?: KeycloakLogoutOptions) {
      await this.instance?.logout({
        redirectUri: window.location.origin,
        ...options
      })
    },

    async updateToken() {
      try {
        const refreshed = await this.instance?.updateToken(70)
        if (refreshed) {
          this.token = this.instance?.token
        }
      } catch (error) {
        console.error('Failed to refresh token', error)
        await this.login()
      }
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
