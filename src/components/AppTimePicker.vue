<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineOptions({
  inheritAttrs: false,
});

const { locale } = useI18n();

const props = withDefaults(defineProps<{ modelValue: string; mask?: string }>(), {
  mask: 'time',
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <q-input v-bind="{ ...props, ...$attrs }">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
    <template #append>
      <q-icon name="eva-clock-outline" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time
            :model-value="props.modelValue"
            @update:model-value="$emit('update:modelValue', $event || '')"
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
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
