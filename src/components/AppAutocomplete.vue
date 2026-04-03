<script setup lang="ts">
import { type QSelectProps } from 'quasar';
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<QSelectProps>(), {
  outlined: true,
  noErrorIcon: true,
  useInput: true,
  fillInput: true,
  hideSelected: false,
  emitValue: true,
  mapOptions: true,
});

defineOptions({
  inheritAttrs: false,
});

// Internal filtered options for autocomplete
const internalOptions = ref<any[]>([...(props.options || [])]);

// Reset options when props.options changes
watch(
  () => props.options,
  (newOptions) => {
    internalOptions.value = [...(newOptions || [])];
  },
  { immediate: true },
);

// Filter function for autocomplete
const filterFn = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      internalOptions.value = [...(props.options || [])];
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    internalOptions.value = (props.options || []).filter((v: any) => {
      const label = typeof v === 'object' ? v.label : v;
      return String(label).toLowerCase().indexOf(needle) > -1;
    });
  });
};
</script>

<template>
  <q-select
    v-bind="{ ...props, ...$attrs }"
    :class="['app-input', $attrs.class]"
    :dark="$q.dark.isActive"
    :options="internalOptions"
    @filter="filterFn"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </q-select>
</template>
