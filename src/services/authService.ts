// src/services/auth.service.ts
import { Platform } from 'quasar';
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'https://keycloak.appwrite-yousef.top/',
  realm: 'CarePulse',
  clientId: 'carepulse'
};

const keycloak = new Keycloak(keycloakConfig);

const REDIRECT_URI = 'myapp://callback'; // ⚠️ change later

function buildLoginUrl() {
  const base = `${keycloakConfig.url}realms/${keycloakConfig.realm}/protocol/openid-connect/auth`;

  const params = new URLSearchParams({
    client_id: keycloakConfig.clientId,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid',
    code_challenge_method: 'S256'
  });

  return `${base}?${params.toString()}`;
}

export const authService = {
  keycloak,

  async init() {
    if (Platform.is.capacitor) {
      // ❌ Do NOT init keycloak-js for login in mobile
      return;
    }

    await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    });
  },

  async login() {
    if (Platform.is.capacitor) {
      const { Browser } = await import('@capacitor/browser');

      const url = buildLoginUrl();

      await Browser.open({ url });

      return;
    }

    // ✅ Web / Electron
    await keycloak.login();
  },

  async logout() {
    if (Platform.is.capacitor) {
      const { Browser } = await import('@capacitor/browser');

      const url = `${keycloakConfig.url}realms/${keycloakConfig.realm}/protocol/openid-connect/logout`;

      await Browser.open({ url });
      return;
    }

    await keycloak.logout();
  }
};