import { defineStore, acceptHMRUpdate } from 'pinia';
import { type PatientProfileResponse } from 'src/api/generated';

interface UserStoreState {
  user: PatientProfileResponse | null;
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
