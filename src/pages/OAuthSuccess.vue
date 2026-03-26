<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { useQuasar } from 'quasar';
import { getApiPatientsProfileOptions } from 'src/api/generated/@tanstack/vue-query.gen';
import { useUserStore } from 'src/stores/user';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const userType = router.currentRoute.value.query.type as string | undefined;
const options = getApiPatientsProfileOptions();
const q = useQuasar();

const { status, data, error } = useQuery({
  ...options,
  enabled: !!userType && userType === 'patient',
});

const userStore = useUserStore();

watch(status, (newStatus) => {
  console.log({ status: status.value, newStatus, data: data.value, error: error.value });
  if (newStatus === 'error') {
    const res = error.value?.response?.data as any;

    if (error.value?.response?.status === 404) {
      router.replace('/patient-register');
      return;
    }

    q.notify({
      type: 'negative',
      message: t('oauthSuccess.errorMessage'),
      caption: String(res?.detail || res?.title),
    });

    router.replace('/');
  } else if (newStatus === 'success') {
    if (!data.value?.id) {
      
      router.replace('/patient-register');
    } else {
      userStore.setUser(data.value);
      router.replace('/patient-dashboard');
    }
  }
});
</script>

<template>
  <q-page class="full-width full-height q-p-none row">
    <div class="column justify-center items-center full-width">
      <p>{{ t('oauthSuccess.redirectMessage') }}</p>
      <q-spinner color="primary" size="3em" :thickness="2" />
    </div>
  </q-page>
</template>

<style scoped></style>
