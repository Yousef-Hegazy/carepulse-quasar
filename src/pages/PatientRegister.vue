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
      <div class="sub-container full-width">
        <q-img
          src="assets/icons/logo-full.svg"
          alt="CarePulse Logo"
          fit="contain"
          width="10.8rem"
          height="auto"
          class="q-mb-sm"
        />

        <div class="q-mb-sm">
          <h3 class="q-mb-sm header">Welcome 👋</h3>
          <p class="text-grey-5">Let us know more about you.</p>
        </div>

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
