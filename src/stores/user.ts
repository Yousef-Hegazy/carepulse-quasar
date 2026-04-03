import { acceptHMRUpdate, defineStore } from 'pinia';
import { type PatientResponse } from 'src/api/generated';

interface UserStoreState {
  user: PatientResponse & {
    firstName: string;
    familyName: string;
    fullName: string;
    email: string;
    emailVerified: boolean;
    username: string;
  } | null;
}

export const useUserStore = defineStore('userStore', {
  state: (): UserStoreState => ({
    user: null
  }),
  getters: {},
  actions: {
    setUser(user: UserStoreState['user']) {
      this.user = user;
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
