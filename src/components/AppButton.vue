<script setup lang="ts">
import { type QBtnProps } from 'quasar';

const props = withDefaults(defineProps<QBtnProps>(), {
  noCaps: true,
  unelevated: true,
  ripple: false,
  size: 'md',
  dense: false,
});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <q-btn v-bind="{ ...props, ...$attrs }" class="app-btn">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </q-btn>
</template>

<style lang="scss">
.app-btn {
  font-weight: 600;
}
</style>
