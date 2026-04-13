<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { QForm, useQuasar } from 'quasar';
import type { Gender, PostApiPatientsData } from 'src/api/generated';
import { postApiPatientsMutation } from 'src/api/generated/@tanstack/vue-query.gen';
import { useAutocompleteSearch } from 'src/composables/useAutocompleteSearch';
import { Doctors } from 'src/lib/doctors';
import { IdentificationTypes } from 'src/lib/identification-types';
import { parseStringToDate } from 'src/lib/utils';
import { useAuthStore } from 'src/stores/auth';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AppDatePicker from '../AppDatePicker.vue';

const { t, locale } = useI18n();
const step = ref(1);
const q = useQuasar();

const { filteredOptions: doctorOptions, filterFn: doctorFilterFn } = useAutocompleteSearch(() =>
  Doctors.map((doctor) => ({
    label: locale.value === 'ar' ? doctor.nameAr : doctor.nameEn,
    value: doctor.nameEn,
    image: doctor.image,
  })),
);

const { filteredOptions: identificationTypeOptions, filterFn: identificationTypeFilterFn } =
  useAutocompleteSearch(() =>
    IdentificationTypes.map((type) => ({
      label: locale.value === 'ar' ? type.ar : type.en,
      value: type.en,
    })),
  );

const formValues = reactive<{
  name: string;
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

const submitMutation = useMutation(postApiPatientsMutation());
const authStore = useAuthStore();
const router = useRouter();

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
      message: t('registerPatientForm.notifications.incompleteForms'),
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
        message: t('registerPatientForm.notifications.personalInfoInvalid'),
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
        message: t('registerPatientForm.notifications.medicalInfoInvalid'),
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
        message: t('registerPatientForm.notifications.identificationInvalid'),
      });
      return;
    }
  } else {
    return;
  }

  // All steps valid - handle form submission
  const formData = new FormData();
  formData.append('Address', formValues.address);
  formData.append('Allergies', formValues.allergies);

  const birthDate = parseStringToDate(formValues.birthDate)?.toISOString();
  if (birthDate) {
    formData.append('BirthDate', birthDate);
  }

  formData.append('CurrentMedication', formValues.currentMedication);
  formData.append('EmergencyContactName', formValues.emergencyContactName);
  formData.append('EmergencyContactNumber', formValues.emergencyContactPhone);
  formData.append('FamilyMedicalHistory', formValues.familyMedicalHistory);
  formData.append('Gender', formValues.gender);

  if (formValues.scannedIdentification) {
    formData.append(
      'IdentificationDocument',
      formValues.scannedIdentification,
      formValues.scannedIdentification.name,
    );
  }

  formData.append('IdentificationNumber', formValues.identificationNumber);

  if (formValues.identificationType?.value) {
    formData.append('IdentificationType', formValues.identificationType.value);
  }

  formData.append('InsurancePolicyNumber', formValues.insurancePolicyNumber);
  formData.append('InsuranceProvider', formValues.insuranceProvider);
  formData.append('Occupation', formValues.occupation);
  formData.append('PastMedicalHistory', formValues.pastMedicalHistory);

  if (formValues.primaryCarePhysician?.value) {
    formData.append('PrimaryPhysicianName', String(formValues.primaryCarePhysician));
  }

  formData.append('PrivacyConsent', String(formValues.privacyConsent));
  formData.append('FullName', formValues.name);
  formData.append('PhoneNumber', formValues.phone);

  submitMutation.mutate(
    {
      headers: { 'Content-Type': null },
      bodySerializer: null,
      body: formData as unknown as PostApiPatientsData['body'],
    },
    {
      onSuccess: (data) => {
        q.notify({
          type: 'positive',
          message: t('registerPatientForm.notifications.submitSuccess'),
        });

        authStore.setProfile(data);

        router.replace('/new-appointment');
      },
      onError: (error) => {
        q.notify({
          type: 'negative',
          message: t('registerPatientForm.notifications.submitError'),
          caption: error.message || '',
        });
      },
    },
  );
};
</script>

<template>
  <q-stepper v-model="step" vertical header-nav animated keep-alive>
    <q-step
      :name="1"
      :title="t('registerPatientForm.steps.personalInfo.title')"
      icon="eva-people-outline"
      :done="step > 1"
      :error="step1HasError"
    >
      <q-form ref="formRef1" @submit.prevent="onStep1Submit">
        <div class="row q-col-gutter-sm">
          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.name"
            :label="t('registerPatientForm.fields.fullName')"
            :rules="[
              (val) =>
                (val !== null && val !== '') || t('registerPatientForm.validation.nameRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-person-outline" />
            </template>
          </q-input>

          <!-- <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.email"
            :label="t('registerPatientForm.fields.emailAddress')"
            :rules="[
              (val) =>
                (val !== null && val !== '') || t('registerPatientForm.validation.emailRequired'),
              (val) =>
                !val ||
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
                t('registerPatientForm.validation.emailInvalid'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-email-outline" />
            </template>
          </q-input> -->

          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.phone"
            :label="t('registerPatientForm.fields.phoneNumber')"
            :rules="[
              (val) =>
                (val !== null && val !== '') || t('registerPatientForm.validation.phoneRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-phone-outline" />
            </template>
          </q-input>

          <app-date-picker
            v-model="formValues.birthDate"
            :label="t('registerPatientForm.fields.dateOfBirth')"
            class="col-12 col-md-6"
            :rules="[
              (val: string) =>
                (val !== null && val !== '') ||
                t('registerPatientForm.validation.birthDateRequired'),
            ]"
          />

          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.address"
            :label="t('registerPatientForm.fields.address')"
            :rules="[
              (val) =>
                (val !== null && val !== '') || t('registerPatientForm.validation.addressRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-map-outline" />
            </template>
          </q-input>

          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.occupation"
            :label="t('registerPatientForm.fields.occupation')"
            :rules="[
              (val) =>
                (val !== null && val !== '') ||
                t('registerPatientForm.validation.occupationRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-briefcase-outline" />
            </template>
          </q-input>

          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.emergencyContactName"
            :label="t('registerPatientForm.fields.emergencyContactName')"
            :rules="[
              (val) =>
                (val !== null && val !== '') ||
                t('registerPatientForm.validation.emergencyContactNameRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-alert-triangle-outline" />
            </template>
          </q-input>

          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.emergencyContactPhone"
            :label="t('registerPatientForm.fields.emergencyContactPhone')"
            :rules="[
              (val) =>
                (val !== null && val !== '') ||
                t('registerPatientForm.validation.emergencyContactPhoneRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-phone-outline" />
            </template>
          </q-input>

          <div class="col-12">
            <p>{{ t('registerPatientForm.fields.gender') }}</p>
            <div class="q-gutter-x-xs row">
              <q-radio
                v-model="formValues.gender"
                val="Male"
                :label="t('registerPatientForm.genderOptions.male')"
                class="col"
              />
              <q-radio
                v-model="formValues.gender"
                val="Female"
                :label="t('registerPatientForm.genderOptions.female')"
                class="col"
              />
              <q-radio
                v-model="formValues.gender"
                val="Other"
                :label="t('registerPatientForm.genderOptions.other')"
                class="col"
              />
            </div>
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn
            type="button"
            color="primary"
            :label="t('registerPatientForm.actions.continue')"
            @click="onStep1Submit"
          />
        </q-stepper-navigation>
      </q-form>
    </q-step>

    <q-step
      :name="2"
      :title="t('registerPatientForm.steps.medicalInfo.title')"
      icon="eva-activity-outline"
      :done="step > 2"
      :error="step2HasError"
    >
      <q-form ref="formRef2" @submit.prevent="onStep2Submit">
        <div class="row q-col-gutter-sm">
          <q-select
            v-model="formValues.primaryCarePhysician"
            :options="doctorOptions"
            @filter="doctorFilterFn"
            :label="t('registerPatientForm.fields.primaryCarePhysician')"
            class="col-12"
            option-value="value"
            option-label="label"
            :fill-input="false"
            clearable
            display-value=""
            :rules="[
              (val) =>
                (val !== null && val !== '') ||
                t('registerPatientForm.validation.primaryCarePhysicianRequired'),
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
            class="q-input col-12 col-md-6"
            v-model="formValues.insuranceProvider"
            :label="t('registerPatientForm.fields.insuranceProvider')"
            :rules="[
              (val) =>
                (val !== null && val !== '') ||
                t('registerPatientForm.validation.insuranceProviderRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-shield-outline" />
            </template>
          </q-input>

          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.insurancePolicyNumber"
            :label="t('registerPatientForm.fields.insurancePolicyNumber')"
            :rules="[
              (val) =>
                (val !== null && val !== '') ||
                t('registerPatientForm.validation.insurancePolicyNumberRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-file-text-outline" />
            </template>
          </q-input>

          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.allergies"
            :label="t('registerPatientForm.fields.allergies')"
            type="textarea"
          />

          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.currentMedication"
            :label="t('registerPatientForm.fields.currentMedication')"
            type="textarea"
          />

          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.familyMedicalHistory"
            :label="t('registerPatientForm.fields.familyMedicalHistory')"
            type="textarea"
          />

          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.pastMedicalHistory"
            :label="t('registerPatientForm.fields.pastMedicalHistory')"
            type="textarea"
          />
        </div>

        <q-stepper-navigation>
          <q-btn
            type="button"
            color="primary"
            :label="t('registerPatientForm.actions.continue')"
            @click="onStep2Submit"
          />
          <q-btn
            type="button"
            flat
            color="primary"
            :label="t('registerPatientForm.actions.back')"
            class="q-ml-sm"
            @click="step = 1"
          />
        </q-stepper-navigation>
      </q-form>
    </q-step>

    <q-step
      :name="3"
      :title="t('registerPatientForm.steps.identification.title')"
      icon="eva-shield-outline"
      :done="step > 3"
      :error="step3HasError"
    >
      <q-form ref="formRef3" @submit.prevent="onFinalSubmit">
        <div class="row q-col-gutter-sm">
          <q-select
            v-model="formValues.identificationType"
            :options="identificationTypeOptions"
            @filter="identificationTypeFilterFn"
            :label="t('registerPatientForm.fields.identificationType')"
            class="col-12"
            option-value="value"
            option-label="label"
            :fill-input="false"
            clearable
            :rules="[
              (val) =>
                (val !== null && val !== '') ||
                t('registerPatientForm.validation.identificationTypeRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-credit-card-outline" />
            </template>
          </q-select>

          <q-input
            class="q-input col-12 col-md-6"
            v-model="formValues.identificationNumber"
            :label="t('registerPatientForm.fields.identificationNumber')"
            :rules="[
              (val) =>
                (val !== null && val !== '') ||
                t('registerPatientForm.validation.identificationNumberRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-hash-outline" />
            </template>
          </q-input>

          <q-file
            class="q-input col-12 col-md-6"
            v-model="formValues.scannedIdentification"
            :label="t('registerPatientForm.fields.scannedIdentification')"
            accept=".pdf,.jpg,.jpeg,.png"
            :rules="[
              (val) =>
                (val !== null && val !== '') ||
                t('registerPatientForm.validation.scannedIdentificationRequired'),
            ]"
          >
            <template #prepend>
              <q-icon name="eva-file-outline" />
            </template>
          </q-file>

          <q-checkbox
            v-model="formValues.privacyConsent"
            :label="t('registerPatientForm.fields.privacyConsent')"
          />
        </div>

        <q-stepper-navigation>
          <q-btn
            type="button"
            color="primary"
            :loading="submitMutation.isPending.value"
            :label="t('registerPatientForm.actions.submit')"
            @click="onFinalSubmit"
          />
          <q-btn
            type="button"
            flat
            color="primary"
            :label="t('registerPatientForm.actions.back')"
            class="q-ml-sm"
            @click="step = 2"
          />
        </q-stepper-navigation>
      </q-form>
    </q-step>
  </q-stepper>
</template>

<style scoped></style>
