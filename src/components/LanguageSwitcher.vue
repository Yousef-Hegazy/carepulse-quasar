<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import AppButton from './AppButton.vue';

const { locale } = useI18n();
const q = useQuasar();

const setLanguage = (lang: string) => {
  // 1. Update the translation locale
  locale.value = lang;

  // 2. Handle RTL logic
  if (lang === 'ar') {
    q.localStorage.set('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    q.localStorage.set('lang', 'en-US');
    document.documentElement.setAttribute('dir', 'ltr');
  }

  document.documentElement.setAttribute('lang', lang);
};
</script>

<template>
  <q-btn :icon="`img:/assets/icons/${locale}.svg`">
    <q-menu auto-close transition-show="fade" transition-hide="fade">
      <q-list style="min-width: 120px">
        <q-item clickable @click="setLanguage('en-US')">
          <q-item-section avatar>
            <q-img src="assets/icons/en-US.svg" width="24px" />
          </q-item-section>
          <q-item-section>English</q-item-section>
        </q-item>

        <q-item clickable @click="setLanguage('ar')">
          <q-item-section avatar>
            <q-img src="assets/icons/ar.svg" width="24px" />
          </q-item-section>
          <q-item-section>العربية</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
