<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { QForm, useQuasar } from 'quasar';
import { postApiAppointmentsMutation } from 'src/api/generated/@tanstack/vue-query.gen';
import AppDatePicker from 'src/components/AppDatePicker.vue';
import AppTimePicker from 'src/components/AppTimePicker.vue';
import LanguageSwitcher from 'src/components/LanguageSwitcher.vue';
import { useAutocompleteSearch } from 'src/composables/useAutocompleteSearch';
import { Doctors } from 'src/lib/doctors';
import { parseStringToDate } from 'src/lib/utils';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const q = useQuasar();

const { filteredOptions: doctorOptions, filterFn: doctorFilterFn } = useAutocompleteSearch(() =>
  Doctors.map((doctor) => ({
    label: locale.value === 'ar' ? doctor.nameAr : doctor.nameEn,
    value: doctor.nameEn,
    image: doctor.image,
  })),
);

const formValues = reactive<{
  scheduleDate: string;
  scheduleTime: string;
  primaryPhysician: (typeof doctorOptions.value)[number] | null;
  reason: string;
  notes: string;
}>({
  scheduleDate: '',
  scheduleTime: '',
  primaryPhysician: null,
  reason: '',
  notes: '',
});

const formRef = ref<InstanceType<typeof QForm> | null>(null);
const hasError = ref(false);

const submitMutation = useMutation(postApiAppointmentsMutation());

const onSubmit = async () => {
  if (!formRef.value) return;

  const isValid = await formRef.value.validate();
  hasError.value = !isValid;

  if (!isValid) {
    q.notify({
      type: 'negative',
      message: t('newAppointmentForm.notifications.invalidForm'),
    });
    return;
  }

  const date = parseStringToDate(formValues.scheduleDate)!.toISOString().split('T')[0];
  const time = formValues.scheduleTime.split(':').filter(Boolean);

  const body = {
    schedule: `${date}T${time[0]}:${time[1]}:00.000Z`,
    primaryPhysician: String(formValues.primaryPhysician || ''),
    reason: formValues.reason,
    notes: formValues.notes,
  };


  submitMutation.mutate(
    {
      body,
    },
    {
      onSuccess: () => {
        q.notify({
          type: 'positive',
          message: t('newAppointmentForm.notifications.submitSuccess'),
        });

        // Reset form
        formValues.scheduleDate = '';
        formValues.scheduleTime = '';
        formValues.primaryPhysician = null;
        formValues.reason = '';
        formValues.notes = '';
      },
      onError: (error) => {
        q.notify({
          type: 'negative',
          message: t('newAppointmentForm.notifications.submitError'),
          caption: error.message || '',
        });
      },
    },
  );
};
</script>

<template>
  <q-page class="row q-pa-none align-items-start">
    <div class="container col-grow full-height q-pt-sm">
      <language-switcher />
      <div class="sub-container q-mx-auto" style="max-width: 800px">
        <q-img
          src="assets/icons/logo-full.svg"
          alt="CarePulse Logo"
          fit="contain"
          width="10.8rem"
          height="auto"
          class="q-mb-xl"
        />

        <p class="text-h4 q-mb-xs">{{ t('newAppointmentForm.title') }}</p>
        <p class="text-subtitle2 text-grey-5">{{ t('newAppointmentForm.subtitle') }}</p>

        <q-form ref="formRef" @submit.prevent="onSubmit">
          <div class="row q-col-gutter-sm">
            <app-date-picker
              v-model="formValues.scheduleDate"
              :label="t('newAppointmentForm.fields.scheduleDate')"
              class="col-12 col-md-6"
              :rules="[
                (val: string) =>
                  (val !== null && val !== '') ||
                  t('newAppointmentForm.validation.scheduleDateRequired'),
              ]"
            />

            <app-time-picker
              v-model="formValues.scheduleTime"
              :label="t('newAppointmentForm.fields.scheduleTime')"
              class="col-12 col-md-6"
              :rules="[
                (val: string) =>
                  (val !== null && val !== '') ||
                  t('newAppointmentForm.validation.scheduleTimeRequired'),
              ]"
            />

            <q-select
              v-model="formValues.primaryPhysician"
              :options="doctorOptions"
              @filter="doctorFilterFn"
              :label="t('newAppointmentForm.fields.primaryPhysician')"
              class="col-12"
              option-value="value"
              option-label="label"
              :fill-input="false"
              clearable
              display-value=""
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  t('newAppointmentForm.validation.primaryPhysicianRequired'),
              ]"
            >
              <template #prepend>
                <q-icon name="eva-person-done-outline" />
              </template>

              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-img :src="scope.opt.image" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:selected-item="scope">
                <q-chip outline size="md" class="q-px-lg q-py-md">
                  <q-avatar>
                    <q-img :src="scope.opt?.image" />
                  </q-avatar>
                  {{ scope.opt?.label }}
                </q-chip>
              </template>
            </q-select>

            <q-input
              class="col-12 col-md-6"
              type="textarea"
              v-model="formValues.reason"
              :label="t('newAppointmentForm.fields.reason')"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || t('newAppointmentForm.validation.reasonRequired'),
              ]"
            >
              <template #prepend>
                <q-icon name="eva-alert-circle-outline" />
              </template>
            </q-input>

            <q-input
              class="col-12 col-md-6"
              type="textarea"
              v-model="formValues.notes"
              :label="t('newAppointmentForm.fields.notes')"
            >
              <template #prepend>
                <q-icon name="eva-file-text-outline" />
              </template>
            </q-input>
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              :loading="submitMutation.isPending.value"
              :label="t('newAppointmentForm.actions.submit')"
              class="full-width"
            />
          </div>
        </q-form>
      </div>
    </div>

    <q-img
      src="assets/images/appointment-img.png"
      v-if="$q.screen.gt.sm"
      height="100vh"
      width="30%"
      fit="cover"
    />
  </q-page>
</template>
