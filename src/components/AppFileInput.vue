<script setup lang="ts">
import { type QFileProps } from 'quasar';

const props = withDefaults(defineProps<QFileProps>(), {
  outlined: true,
  dark: true,
  noErrorIcon: true,
});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <q-file v-bind="{ ...props, ...$attrs }" :class="['app-input', $attrs.class]">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </q-file>
</template>
