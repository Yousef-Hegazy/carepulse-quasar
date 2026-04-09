<script setup lang="ts">
import { storeToRefs } from 'pinia';
import LanguageSwitcher from 'src/components/LanguageSwitcher.vue';
import { useAuthStore } from 'src/stores/auth';

const authStore = useAuthStore();
const { profile } = storeToRefs(authStore);
</script>

<template>
  <q-page>
    <language-switcher />
    <p>Hello {{ profile?.fullName }}</p>
  </q-page>
</template>

<style scoped></style>
