<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import AppButton from '../AppButton.vue';
import AppRadio from '../AppRadio.vue';
import AppInput from '../AppInput.vue';
import AppDatePicker from '../AppDatePicker.vue';
import AppAutocomplete from '../AppAutocomplete.vue';
import AppFileInput from '../AppFileInput.vue';
import { Doctors } from 'src/lib/doctors';
import { IdentificationTypes } from 'src/lib/identification-types';
import AppCheckbox from '../AppCheckbox.vue';
import { useI18n } from 'vue-i18n';
import { QForm, useQuasar } from 'quasar';
import { useMutation } from '@tanstack/vue-query';
import { postApiPatientsMutation } from 'src/api/generated/@tanstack/vue-query.gen';
import type { Gender } from 'src/api/generated';

const { locale } = useI18n();
const step = ref(1);
const q = useQuasar();

const doctorOptions = computed(() =>
  Doctors.map((doctor) => ({
    label: locale.value === 'ar' ? doctor.nameAr : doctor.nameEn,
    value: doctor.nameEn,
    image: doctor.image,
  })),
);

const identificationTypeOptions = computed(() =>
  IdentificationTypes.map((type) => ({
    label: locale.value === 'ar' ? type.ar : type.en,
    value: type.en,
  })),
);

const formValues = reactive<{
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  primaryCarePhysician: (typeof doctorOptions.value)[number] | null;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string;
  currentMedication: string;
  familyMedicalHistory: string;
  pastMedicalHistory: string;
  identificationType: (typeof identificationTypeOptions.value)[number] | null;
  identificationNumber: string;
  scannedIdentification: File | null;
  privacyConsent: boolean;
}>({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: 'Male',
  address: '',
  occupation: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  primaryCarePhysician: null,
  insuranceProvider: '',
  insurancePolicyNumber: '',
  allergies: '',
  currentMedication: '',
  familyMedicalHistory: '',
  pastMedicalHistory: '',
  identificationType: null,
  identificationNumber: '',
  scannedIdentification: null,
  privacyConsent: false,
});

const parseDate = (date: string) => {
  const [y, m, d] = date.split('/');
  return new Date(Number(y), Number(m) - 1, Number(d));
};

const submitMutation = useMutation(postApiPatientsMutation());

// Step error states
const step1HasError = ref(false);
const step2HasError = ref(false);
const step3HasError = ref(false);

const formRef1 = ref<InstanceType<typeof QForm> | null>(null);
const formRef2 = ref<InstanceType<typeof QForm> | null>(null);
const formRef3 = ref<InstanceType<typeof QForm> | null>(null);

const onStep1Submit = async () => {
  if (!formRef1.value) return;
  const isValid = await formRef1.value.validate();
  step1HasError.value = !isValid;
  step.value = 2;
};

const onStep2Submit = async () => {
  if (!formRef2.value) return;
  const isValid = await formRef2.value.validate();
  step2HasError.value = !isValid;
  step.value = 3;
};

const onFinalSubmit = async () => {
  if (!formRef1.value || !formRef2.value || !formRef3.value) {
    q.notify({
      type: 'negative',
      message: 'Please make sure to check all the forms and enter valid data',
    });

    if (!formRef1.value) {
      step.value = 1;
    }

    if (!formRef2.value) {
      step.value = 2;
    }

    if (!formRef3.value) {
      step.value = 3;
    }
  }

  // Validate step 1
  if (formRef1.value) {
    const isValid = await formRef1.value.validate();
    step1HasError.value = !isValid;
    if (!isValid) {
      q.notify({
        type: 'negative',
        message: 'Please make sure that Personal Information are all valid.',
      });
    }
  } else {
    return;
  }

  // Validate step 2
  if (formRef2.value) {
    const isValid = await formRef2.value.validate();
    step2HasError.value = !isValid;
    if (!isValid) {
      q.notify({
        type: 'negative',
        message: 'Please make sure that Medical Information are all valid.',
      });
    }
  } else {
    return;
  }

  // Validate step 3
  if (formRef3.value) {
    const isValid = await formRef3.value.validate();
    step3HasError.value = !isValid;
    if (!isValid) {
      q.notify({
        type: 'negative',
        message: 'Please make sure that Identification and Verification are all valid.',
      });
      return;
    }
  } else {
    return;
  }

  // All steps valid - handle form submission
  console.log('Form submitted:', { ...formValues });
  submitMutation.mutate({
    body: {
      Address: formValues.address,
      Allergies: formValues.allergies,
      BirthDate: formValues.birthDate ? parseDate(formValues.birthDate).toISOString() : undefined,
      CurrentMedication: formValues.currentMedication,
      EmergencyContactName: formValues.emergencyContactName,
      EmergencyContactNumber: formValues.emergencyContactPhone,
      FamilyMedicalHistory: formValues.familyMedicalHistory,
      Gender: formValues.gender,
      IdentificationDocument: formValues.scannedIdentification || undefined,
      IdentificationNumber: formValues.identificationNumber,
      IdentificationType: formValues.identificationType?.value,
      InsurancePolicyNumber: formValues.insurancePolicyNumber,
      InsuranceProvider: formValues.insuranceProvider,
      Occupation: formValues.occupation,
      PastMedicalHistory: formValues.pastMedicalHistory,
      PrimaryPhysicianName: formValues.primaryCarePhysician?.value,
      PrivacyConsent: formValues.privacyConsent,
    },
  });
};
</script>

<template>
  <q-stepper v-model="step" vertical header-nav animated keep-alive>
    <q-step
      :name="1"
      title="Personal Information"
      icon="eva-people-outline"
      :done="step > 1"
      :error="step1HasError"
    >
      <q-form ref="formRef1" @submit.prevent="onStep1Submit">
        <div class="row q-col-gutter-sm">
          <app-input
            class="app-input col-6"
            v-model="formValues.name"
            label="Full Name"
            :rules="[(val) => (val !== null && val !== '') || 'Please enter your name']"
          >
            <template #prepend>
              <q-icon name="eva-person-outline" />
            </template>
          </app-input>

          <app-input
            class="app-input col-6"
            v-model="formValues.email"
            label="Email Address"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please enter your email',
              (val) =>
                !val ||
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
                'Please enter a valid email address',
            ]"
          >
            <template #prepend>
              <q-icon name="eva-email-outline" />
            </template>
          </app-input>

          <app-input
            class="app-input col-6"
            v-model="formValues.phone"
            label="Phone Number"
            :rules="[(val) => (val !== null && val !== '') || 'Please enter your phone number']"
          >
            <template #prepend>
              <q-icon name="eva-phone-outline" />
            </template>
          </app-input>

          <app-date-picker
            v-model="formValues.birthDate"
            label="Date of Birth"
            class="col-6"
            :rules="[
              (val: string) => (val !== null && val !== '') || 'Please select your date of birth',
            ]"
          />

          <app-input
            class="app-input col-6"
            v-model="formValues.address"
            label="Address"
            :rules="[(val) => (val !== null && val !== '') || 'Please enter your address']"
          >
            <template #prepend>
              <q-icon name="eva-map-outline" />
            </template>
          </app-input>

          <app-input
            class="app-input col-6"
            v-model="formValues.occupation"
            label="Occupation"
            :rules="[(val) => (val !== null && val !== '') || 'Please enter your occupation']"
          >
            <template #prepend>
              <q-icon name="eva-briefcase-outline" />
            </template>
          </app-input>

          <app-input
            class="app-input col-6"
            v-model="formValues.emergencyContactName"
            label="Emergency Contact Name"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please enter emergency contact name',
            ]"
          >
            <template #prepend>
              <q-icon name="eva-alert-triangle-outline" />
            </template>
          </app-input>

          <app-input
            class="app-input col-6"
            v-model="formValues.emergencyContactPhone"
            label="Emergency Contact Phone"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please enter emergency contact phone',
            ]"
          >
            <template #prepend>
              <q-icon name="eva-phone-outline" />
            </template>
          </app-input>

          <div class="col-12">
            <p>Gender</p>
            <div class="q-gutter-x-xs row">
              <app-radio v-model="formValues.gender" val="Male" label="Male" class="col" />
              <app-radio v-model="formValues.gender" val="Female" label="Female" class="col" />
              <app-radio v-model="formValues.gender" val="Other" label="Other" class="col" />
            </div>
          </div>
        </div>

        <q-stepper-navigation>
          <app-button type="button" color="primary" label="Continue" @click="onStep1Submit" />
        </q-stepper-navigation>
      </q-form>
    </q-step>

    <q-step
      :name="2"
      title="Medical Information"
      icon="eva-activity-outline"
      :done="step > 2"
      :error="step2HasError"
    >
      <q-form ref="formRef2" @submit.prevent="onStep2Submit">
        <div class="row q-col-gutter-sm">
          <app-autocomplete
            v-model="formValues.primaryCarePhysician"
            :options="doctorOptions"
            label="Primary Care Physician"
            class="col-12"
            option-value="value"
            option-label="label"
            :fill-input="false"
            clearable
            display-value=""
            :rules="[
              (val) => (val !== null && val !== '') || 'Please select primary care physician',
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
          </app-autocomplete>

          <app-input
            class="app-input col-6"
            v-model="formValues.insuranceProvider"
            label="Insurance Provider"
            :rules="[(val) => (val !== null && val !== '') || 'Please enter insurance provider']"
          >
            <template #prepend>
              <q-icon name="eva-shield-outline" />
            </template>
          </app-input>

          <app-input
            class="app-input col-6"
            v-model="formValues.insurancePolicyNumber"
            label="Insurance Policy Number"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please enter insurance policy number',
            ]"
          >
            <template #prepend>
              <q-icon name="eva-file-text-outline" />
            </template>
          </app-input>

          <app-input
            class="app-input col-6"
            v-model="formValues.allergies"
            label="Allergies"
            type="textarea"
          />

          <app-input
            class="app-input col-6"
            v-model="formValues.currentMedication"
            label="Current Medication"
            type="textarea"
          />

          <app-input
            class="app-input col-6"
            v-model="formValues.familyMedicalHistory"
            label="Family Medical History"
            type="textarea"
          />

          <app-input
            class="app-input col-6"
            v-model="formValues.pastMedicalHistory"
            label="Past Medical History"
            type="textarea"
          />
        </div>

        <q-stepper-navigation>
          <app-button type="button" color="primary" label="Continue" @click="onStep2Submit" />
          <app-button
            type="button"
            flat
            color="primary"
            label="Back"
            class="q-ml-sm"
            @click="step = 1"
          />
        </q-stepper-navigation>
      </q-form>
    </q-step>

    <q-step
      :name="3"
      title="Identification and Verification"
      icon="eva-shield-outline"
      :done="step > 3"
      :error="step3HasError"
    >
      <q-form ref="formRef3" @submit.prevent="onFinalSubmit">
        <div class="row q-col-gutter-sm">
          <app-autocomplete
            v-model="formValues.identificationType"
            :options="identificationTypeOptions"
            label="Identification Type"
            class="col-12"
            option-value="value"
            option-label="label"
            :fill-input="false"
            clearable
            :rules="[(val) => (val !== null && val !== '') || 'Please select identification type']"
          >
            <template #prepend>
              <q-icon name="eva-credit-card-outline" />
            </template>
          </app-autocomplete>

          <app-input
            class="app-input col-6"
            v-model="formValues.identificationNumber"
            label="Identification Number"
            :rules="[(val) => (val !== null && val !== '') || 'Please enter identification number']"
          >
            <template #prepend>
              <q-icon name="eva-hash-outline" />
            </template>
          </app-input>

          <app-file-input
            class="app-input col-6"
            v-model="formValues.scannedIdentification"
            label="Scanned Copy of Identification Document"
            accept=".pdf,.jpg,.jpeg,.png"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please upload identification document',
            ]"
          >
            <template #prepend>
              <q-icon name="eva-file-outline" />
            </template>
          </app-file-input>

          <app-checkbox
            v-model="formValues.privacyConsent"
            label="I acknowledge that I have reviewed and agree to the privacy policy"
          />
        </div>

        <q-stepper-navigation>
          <app-button
            type="button"
            color="primary"
            :loading="submitMutation.isPending.value"
            label="Submit"
            @click="onFinalSubmit"
          />
          <app-button
            type="button"
            flat
            color="primary"
            label="Back"
            class="q-ml-sm"
            @click="step = 2"
          />
        </q-stepper-navigation>
      </q-form>
    </q-step>
  </q-stepper>
</template>

<style scoped></style>
