import { defineBoot } from '#q-app/wrappers';
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'https://keycloak.appwrite-yousef.top/',
  realm: 'CarePulse',
  clientId: 'carepulse'
};

const keycloak = new Keycloak(keycloakConfig);

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(async ({ app, router }) => {

  keycloak.onTokenExpired = async () => {
    try {
      await keycloak.updateToken(0);
    } catch (error) {
      await keycloak.login({
        redirectUri: window.location.origin + '/oauth-success?type=' + (keycloak.tokenParsed?.realm_access?.roles.includes('doctor') ? 'doctor' : 'patient'),
      });
    }
  };


  try {
    await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    });

    app.config.globalProperties.$keycloak = keycloak


    router.beforeEach(async (to) => {
      const isPublic = to.matched.some(record => record.meta.public);

      if (!isPublic && !keycloak.authenticated) {
        await keycloak.login();
        return false;
      } else {
        return true;
      }
    });
  } catch (error) {
    console.error('Failed to initialize Keycloak:', error);
  }
});

export { keycloak };
