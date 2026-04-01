<script setup lang="ts">
import { type QInputProps } from 'quasar';

const props = withDefaults(defineProps<QInputProps>(), {
  outlined: true,
  dark: true,
  noErrorIcon: true,
  autocomplete: 'off',
  spellcheck: false,
});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <q-input v-bind="{ ...props, ...$attrs }" :class="['app-input', $attrs.class]">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </q-input>
</template>

<style lang="scss">
.app-input {
  font-weight: 600;

  &.q-field--focused {
    & .q-icon {
      color: $primary;
    }
  }
  & .q-field__control.text-negative {
    & .q-icon {
      color: $negative;
    }
  }
}
</style>
