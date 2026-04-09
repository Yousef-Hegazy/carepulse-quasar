<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { useQuasar } from 'quasar';
import { emailRegex } from 'src/lib/constants';
import { useAuthStore } from 'src/stores/auth';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const REGISTER_QUERY_KEY = 'register';
const LOGIN_QUERY_KEY = 'login';
const AUTH_QUERY_KEY = 'auth';

const { t } = useI18n();
const q = useQuasar();
const router = useRouter();
const route = useRoute();

const userType = ref('patient');
const isRegister = computed(() => route.query[AUTH_QUERY_KEY] === REGISTER_QUERY_KEY);
const authStore = useAuthStore();
const formValues = reactive({
  email: '',
  password: '',
});

const isPasswordVisible = ref(false);

const { isPending, mutate } = useMutation({
  mutationFn: () =>
    isRegister.value ? authStore.register(formValues) : authStore.login(formValues),
  onSuccess: (res) => {
    if (res?.accessToken) {
      router.replace(`/oauth-success?type=${userType.value}`);
    } else {
      if (!isRegister.value) {
        q.notify({
          message: t('auth.loginError'),
          color: 'negative',
        });
      }
    }
  },
  onError: (error) => {
    console.error('API Error:', error);
    if (isRegister.value) {
      q.notify({
        message: error.message
          ? error.message.replace('Username', 'Email')
          : t('patientForm.errorMessage'),
        color: 'negative',
      });
    } else {
      q.notify({
        message: error.message || t('patientForm.errorMessage'),
        color: 'negative',
      });
    }
  },
});

const onSubmit = () => mutate();
</script>

<template>
  <q-form @submit="onSubmit" class="q-pa-sm q-gutter-y-md">
    <h1 class="header q-mb-xs">{{ t('patientForm.title') }} 👋</h1>
    <p class="text-grey-5">
      {{
        userType === 'patient' ? t('patientForm.patientSubtitle') : t('patientForm.doctorSubtitle')
      }}
    </p>

    <q-input
      v-model="formValues.email"
      :label="t('auth.email')"
      class="col"
      :rules="[
        (val) => !!val || t('auth.emailRequired'),
        (val) => !val || emailRegex.test(val) || t('auth.emailInvalid'),
      ]"
    />

    <q-input
      v-model="formValues.password"
      :label="t('auth.password')"
      :type="isPasswordVisible ? 'text' : 'password'"
      class="col"
      :rules="[
        (val) => !!val || t('auth.passwordMinError'),
        (val) => !val || val.length >= 6 || t('auth.passwordMinError'),
        (val) => !val || /[A-Z]/.test(val) || t('auth.passwordUppercaseError'),
        (val) => !val || /[a-z]/.test(val) || t('auth.passwordLowercaseError'),
        (val) => !val || /[0-9]/.test(val) || t('auth.passwordNumberError'),
        (val) => {
          if (!val) return true;
          const specialCharRegex = /[!@#$%^&*(),.?&quot;:{}|<>\-+=\[\]\\;'/`~]/;
          return specialCharRegex.test(val) || t('auth.passwordSpecialError');
        },
      ]"
    >
      <template #append>
        <q-btn
          :icon="isPasswordVisible ? 'eva-eye-off-2' : 'eva-eye'"
          round
          unelevated
          @click="isPasswordVisible = !isPasswordVisible"
        />
      </template>
    </q-input>

    <div class="row q-gutter-x-sm">
      <q-radio v-model="userType" val="patient" :label="t('patientForm.patient')" class="col" />

      <q-radio v-model="userType" val="doctor" :label="t('patientForm.doctor')" class="col" disable>
        <q-tooltip class="text-subtitle2">
          {{ t('patientForm.doctorDisabledMessage') }}
        </q-tooltip>
      </q-radio>
    </div>

    <q-btn
      color="primary"
      type="submit"
      class="full-width"
      :label="t(isRegister ? 'auth.register' : 'auth.login')"
      :icon-right="isRegister ? 'eva-person-add-outline' : 'eva-log-in-outline'"
      :loading="isPending"
    />

    <p
      class="text-subtitle2"
      v-if="isRegister"
      :style="{
        pointerEvents: isPending ? 'none' : 'auto',
        opacity: isPending ? 0.6 : 1,
      }"
    >
      {{ t('auth.alreadyHaveAnAccount') }}
      <router-link
        :to="{ query: { [AUTH_QUERY_KEY]: LOGIN_QUERY_KEY } }"
        class="q-pa-none q-py-none text-body2"
        style="text-decoration: none; color: currentColor"
      >
        {{ t('auth.login') }}
      </router-link>
    </p>

    <p
      class="text-subtitle2"
      v-else
      :style="{
        pointerEvents: isPending ? 'none' : 'auto',
        opacity: isPending ? 0.6 : 1,
      }"
    >
      {{ t('auth.dontHaveAnAccount') }}
      <router-link
        :to="{ query: { [AUTH_QUERY_KEY]: REGISTER_QUERY_KEY } }"
        class="q-pa-none q-py-none text-body2"
        style="text-decoration: none; color: currentColor"
      >
        {{ t('auth.register') }}
      </router-link>
    </p>
  </q-form>

  <div class="text-body2 q-mt-lg row full-width justify-between items-center no-wrap">
    <p class="q-mb-none">
      &copy; {{ t('indexPage.copyright', { year: new Date().getFullYear() }) }}
    </p>

    <q-btn
      @click="
        () => {
          userType = 'admin';
          mutate();
        }
      "
      flat
      size="md"
      :loading="isPending"
      color="primary"
      :label="t('indexPage.admin')"
    />
  </div>
</template>

<style scoped></style>
