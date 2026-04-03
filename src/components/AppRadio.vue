<script setup lang="ts">
import { type QRadioProps } from 'quasar';

const props = withDefaults(defineProps<QRadioProps>(), {
  dark: true,
  size: 'sm',
});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <q-radio class="app-radio" v-bind="{ ...props, ...$attrs }">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </q-radio>
</template>
