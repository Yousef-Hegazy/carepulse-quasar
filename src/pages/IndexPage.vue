<script setup lang="ts">
import AuthForm from 'src/components/forms/AuthForm.vue';
import LanguageSwitcher from 'src/components/LanguageSwitcher.vue';
</script>

<template>
  <q-page class="q-p-none row no-wrap full-width full-height">
    <div class="absolute-top-left q-pa-sm">
      <language-switcher />
    </div>

    <section class="remove-scrollbar container q-my-auto col-grow">
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

    <q-img src="assets/images/onboarding-img.png" class="col-grow" />
  </q-page>
</template>

<style lang="scss" scoped>
.max-w-xxs {
  max-width: $bp-xxs;
  width: 100%;
}

// .carepulse {
//   width: 4rem;
//   height: 2.5rem;

//   img {
//     height: 100%;
//   }
// }
</style>
