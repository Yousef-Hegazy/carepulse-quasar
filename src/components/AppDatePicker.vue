<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<{ modelValue: string; mask?: string }>(), {
  mask: 'date',
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
      <slot name="append">
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              :model-value="props.modelValue"
              @update:model-value="$emit('update:modelValue', $event)"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </slot>
    </template>
  </q-input>
</template>
