<script setup lang="ts">
import RegisterPatientForm from 'src/components/forms/RegisterPatientForm.vue';
import LanguageSwitcher from 'src/components/LanguageSwitcher.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <q-page class="q-p-none row no-wrap full-width full-height">
    <section class="remove-scrollbar container q-mt-xl col-grow">
      <language-switcher />
      <div class="sub-container full-width">
        <q-img
          src="assets/icons/logo-full.svg"
          :alt="t('patientRegisterPage.logoAlt')"
          fit="contain"
          width="10.8rem"
          height="auto"
          class="q-mb-sm"
        />

        <div class="q-mb-sm">
          <h3 class="q-mb-sm header">{{ t('patientRegisterPage.welcome') }} 👋</h3>
          <p class="text-grey-5">{{ t('patientRegisterPage.subtitle') }}</p>
        </div>

        <register-patient-form />
      </div>
    </section>

    <q-img
      src="assets/images/register-img.png"
      :alt="t('patientRegisterPage.registerImageAlt')"
      class="col-grow"
      v-if="$q.screen.gt.sm"
    />
  </q-page>
</template>
