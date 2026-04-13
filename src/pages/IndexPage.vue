<script setup lang="ts">
import AuthForm from 'src/components/forms/AuthForm.vue';
import LanguageSwitcher from 'src/components/LanguageSwitcher.vue';
</script>

<template>
  <q-page class="q-p-none row no-wrap full-width full-height">
    <section class="remove-scrollbar container q-my-auto col-grow">
      <language-switcher />
      
      <div class="sub-container max-w-xxs">
        <q-img
          src="assets/icons/logo-full.svg"
          alt="CarePulse Logo"
          fit="contain"
          width="10.8rem"
          height="auto"
          class="q-mb-xl"
        />

        <auth-form />
      </div>
    </section>

    <q-img src="assets/images/onboarding-img.png" alt="Onboarding" class="col-grow gt-sm" />
  </q-page>
</template>
