<script setup lang="ts"></script>

<template>
  <q-page class="column justify-center items-center full-height full-width q-pa-none q-gutter-none">
    <router-link to="/">
      <q-img
        src="assets/icons/logo-full.svg"
        alt="CarePulse Logo"
        fit="contain"
        width="10.8rem"
        height="auto"
        class="q-mb-md"
      />
    </router-link>

    <q-img
      src="assets/gifs/success.gif"
      alt="Success"
      width="300px"
      height="180px"
      class="q-mb-sm"
    />

    <h2
      class="text-h4 text-center text-weight-bold q-mb-md"
      :style="{
        maxWidth: '600px',
      }"
    >
      Your <span class="text-teal-4">appointment request</span> has been successfully submitted!
    </h2>

    <p class="text-center text-body1 text-grey-5">You will receive a confirmation email shortly.</p>

    <section>
      <p>Requested appointment details:</p>
      <div class="row items-center q-gutter-sm">
        <!-- <q-img /> -->
      </div>
    </section>
  </q-page>
</template>

<style scoped></style>
