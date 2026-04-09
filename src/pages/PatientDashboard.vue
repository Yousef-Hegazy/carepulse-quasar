<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>

<template>
  <q-page>
    <p>Hello {{ user?.fullName }}</p>
  </q-page>
</template>

<style scoped></style>
