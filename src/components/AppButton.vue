<script setup lang="ts">
import { type QBtnProps } from 'quasar';

const props = withDefaults(defineProps<QBtnProps>(), {
  noCaps: true,
  unelevated: true,
  ripple: false,
  size: 'md',
  dense: false,
  type: 'button',
});
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <q-btn v-bind="{ ...props, ...$attrs }" :class="['app-btn', $attrs.class]">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </q-btn>
</template>
