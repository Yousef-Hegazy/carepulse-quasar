<script setup lang="ts">
import { type AppointmentResponse } from 'src/api/generated';
import { Doctors } from 'src/lib/doctors';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { formatDateTime } from 'src/lib/utils';

const { locale, t } = useI18n();
const route = useRoute();
const appointment: AppointmentResponse = route.query as unknown as AppointmentResponse;
const doctor = Doctors.find((doc) => doc.nameEn === appointment.primaryPhysician);
</script>

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

    <p class="text-center text-body1 text-grey-5 q-mb-md">
      You will receive a confirmation email shortly.
    </p>

    <section
      class="appointment-details-card row q-gutter-x-sm items-center justify-start q-mb-md"
      v-if="doctor"
    >
      <p class="text-body2">Requested appointment details:</p>
      <div class="row items-center q-gutter-x-sm">
        <q-img :src="doctor.image" width="32px" height="32px" />
        <p>Dr. {{ locale === 'ar' ? doctor.nameAr : doctor.nameEn }}</p>
        <q-icon name="eva-calendar-outline" size="24px" class="text-grey-5" />
        <p v-if="appointment.schedule">{{ formatDateTime(appointment.schedule).dateTime }}</p>
      </div>
    </section>

    <q-btn rounded label="New Appointment" color="primary" icon="eva-plus-circle-outline" class="q-mb-lg" to="/new-appointment" />

    <p class="q-mb-none text-grey-6">
      &copy; {{ t('indexPage.copyright', { year: new Date().getFullYear() }) }}
    </p>
  </q-page>
</template>

<style scoped lang="scss">
.appointment-details-card {
  border-top: 1px dotted $grey-7;
  border-bottom: 1px dotted $grey-7;
  padding: 1rem 0;
}
</style>
