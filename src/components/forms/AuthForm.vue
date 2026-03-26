<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { useQuasar } from 'quasar';
import { keycloak } from 'src/boot/keycloak';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '../AppButton.vue';
import AppRadio from '../AppRadio.vue';
import AppTooltip from '../AppTooltip.vue';

const { t } = useI18n();
const q = useQuasar();

const userType = ref('patient');

const { isPending, mutate } = useMutation({
  mutationFn: async () => {
    await keycloak.logout({
      redirectUri: window.location.origin,
      logoutMethod: 'POST',
    });
    return await keycloak.login({
      redirectUri: window.location.origin + '/oauth-success?type=' + userType.value,
    });
  },
  onError: (error) => {
    console.error('API Error:', error);
    q.notify({
      message: t('patientForm.errorMessage'),
      color: 'negative',
    });
  },
});
</script>

<template>
  <div class="q-pa-sm q-gutter-y-md">
    <h1 class="header q-mb-xs">{{ t('patientForm.title') }} 👋</h1>
    <p class="text-grey-5">
      {{
        userType === 'patient' ? t('patientForm.patientSubtitle') : t('patientForm.doctorSubtitle')
      }}
    </p>

    <div class="row q-gutter-x-sm">
      <app-radio v-model="userType" val="patient" :label="t('patientForm.patient')" class="col" />
      <app-radio
        v-model="userType"
        val="doctor"
        :label="t('patientForm.doctor')"
        class="col"
        disable
      >
        <q-tooltip class="text-subtitle2">
          {{ t('patientForm.doctorDisabledMessage') }}
        </q-tooltip>
      </app-radio>
    </div>

    <app-button
      color="primary"
      type="submit"
      class="full-width"
      @click="() => mutate()"
      :label="t('patientForm.submit')"
      :icon-right="$i18n.locale === 'ar' ? 'eva-chevron-left' : 'eva-chevron-right'"
      :loading="isPending"
    />
  </div>

  <div class="text-body2 q-mt-lg row full-width justify-between items-center no-wrap">
    <p class="q-mb-none">
      &copy; {{ t('indexPage.copyright', { year: new Date().getFullYear() }) }}
    </p>

    <app-button
      @click="
        () => {
          userType = 'admin';
          mutate();
        }
      "
      flat
      size="md"
      :loading="isPending"
      color="primary"
      :label="t('indexPage.admin')"
    />
  </div>
</template>

<style scoped></style>
