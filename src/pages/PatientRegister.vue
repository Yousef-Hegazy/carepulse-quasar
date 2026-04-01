<script setup lang="ts">
import RegisterPatientForm from 'src/components/forms/RegisterPatientForm.vue';
import LanguageSwitcher from 'src/components/LanguageSwitcher.vue';
</script>

<template>
  <q-page class="q-p-none row no-wrap full-width full-height">
    <div class="absolute-top-left q-pa-sm">
      <language-switcher />
    </div>

    <section class="remove-scrollbar container q-mt-xl col-grow">
      <div class="sub-container max-w-xxs">
        <q-img
          src="assets/icons/logo-full.svg"
          alt="CarePulse Logo"
          fit="contain"
          width="10.8rem"
          height="auto"
          class="q-mb-xl"
        />

        <register-patient-form />
      </div>
    </section>

    <q-img
      src="assets/images/register-img.png"
      alt="Register"
      class="col-grow"
      v-if="$q.screen.gt.sm"
    />
  </q-page>
</template>
