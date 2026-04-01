<script setup lang="ts">
import { reactive, ref } from 'vue';
import AppInput from '../AppInput.vue';
import AppButton from '../AppButton.vue';

const step = ref(1);

const formValues = reactive({
  name: '',
  phone: '',
});
</script>

<template>
  <q-stepper v-model="step" vertical header-nav animated>
    <q-step
      :name="1"
      title="Personal Information"
      active-icon="eva-people-outline"
      :done="step > 1"
    >
      <app-input
        v-model="formValues.name"
        label="Name"
        :rules="[(val) => (val !== null && val !== '') || 'Please enter your name']"
        class="q-mb-sm"
      >
        <template #prepend>
          <q-icon name="eva-person-outline" />
        </template>
      </app-input>

      <app-input v-model="formValues.phone" label="Phone" />

      <q-stepper-navigation>
        <app-button @click="step = 2" color="primary" label="Continue" />
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>

<style scoped></style>
