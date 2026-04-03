<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from 'src/stores/user';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
console.log({ ...user.value });
</script>

<template>
  <q-page>
    <p>Hello {{ user?.firstName }}</p>
  </q-page>
</template>

<style scoped></style>
