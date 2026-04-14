<script setup lang="ts">
import { date } from 'quasar';
import { parseStringToDate } from 'src/lib/utils';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{ modelValue: string; mask?: string; futureOnly?: boolean }>(),
  {
    mask: 'date',
    futureOnly: false,
  },
);

const { locale } = useI18n();
const openPopup = ref(false);


function togglePopup() {
  openPopup.value = !openPopup.value;
}

function futureOptsFn(dateString: string) {
  if (date.isValid(dateString)) {
    const dateInput = parseStringToDate(dateString)!;
    return dateInput.getTime() >= new Date().getTime();
  } else {
    return false;
  }
}

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <q-input v-bind="{ ...props, ...$attrs }" readonly @click="togglePopup" class="popup-input">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
    <template #append>
      <slot name="append">
        <q-icon name="eva-calendar-outline" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="openPopup">
            <q-date
              :model-value="props.modelValue"
              @update:model-value="$emit('update:modelValue', $event)"
              flat
              :options="props.futureOnly ? futureOptsFn : undefined"
            >
              <div class="row items-center justify-end">
                <q-btn
                  @click="togglePopup"
                  :label="locale === 'ar' ? 'اغلاق' : 'Close'"
                  color="primary"
                  flat
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </slot>
    </template>
  </q-input>
</template>
