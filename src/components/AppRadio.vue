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
  <q-radio v-bind="{ ...props, ...$attrs }" class="app-radio">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </q-radio>
</template>

<style lang="scss">
.app-radio {
  font-weight: 600;
  width: 100%;
  padding: 0.5rem 0.75rem;
  transition: all $generic-hover-transition;
  border-radius: $generic-border-radius;
  border: 1px solid transparent;

  &[aria-checked='true'] {
    border-color: $primary;
    background-color: rgba($primary, 0.1);
  }

  &:hover {
    background-color: rgba($primary, 0.1);
  }

  & .q-radio__inner::before {
    opacity: 0 !important;
  }
}
</style>
