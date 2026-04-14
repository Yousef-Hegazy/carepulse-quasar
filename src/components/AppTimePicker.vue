<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<{ modelValue: string; mask?: string }>(), {
  mask: 'time',
});

const { locale } = useI18n();

const openPopup = ref(false);

function togglePopup() {
  openPopup.value = !openPopup.value;
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
      <q-icon name="eva-clock-outline" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="openPopup">
          <q-time
            :model-value="props.modelValue"
            @update:model-value="$emit('update:modelValue', $event || '')"
          >
            <div class="row items-center justify-end">
              <q-btn
                @click="togglePopup"
                :label="locale === 'ar' ? 'اغلاق' : 'Close'"
                color="primary"
                flat
              />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
