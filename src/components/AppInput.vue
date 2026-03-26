<script setup lang="ts">
import { type QInputProps } from 'quasar';

const props = withDefaults(defineProps<QInputProps>(), {
  outlined: true,
  dark: true,
});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <q-input v-bind="{ ...props, ...$attrs }" class="app-input" autocomplete="off" spellcheck="false" :no-error-icon="true">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </q-input>
</template>

<style lang="scss">
.app-input {
  font-weight: 600;
}
</style>
