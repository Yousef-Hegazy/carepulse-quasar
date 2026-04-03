<script setup lang="ts">
import { type QCheckboxProps } from 'quasar';

const props = withDefaults(defineProps<QCheckboxProps>(), {});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <q-checkbox v-bind="{ ...props, ...$attrs }" :class="['app-checkbox', $attrs.class]">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </q-checkbox>
</template>
