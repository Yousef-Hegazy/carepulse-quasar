import { ref, toValue, watch, type MaybeRefOrGetter } from 'vue';

type FilterAfterFn = (ref: any) => void;
type FilterUpdateFn = (callback: () => void, afterFn?: FilterAfterFn) => void;

export type AutocompleteFilterFn = (
  val: string,
  update: FilterUpdateFn,
  abort?: () => void,
) => void;

export type GetOptionLabel<TOption> = (option: TOption) => unknown;

function defaultGetLabel<TOption>(option: TOption): unknown {
  if (typeof option === 'object' && option !== null && 'label' in (option as any)) {
    return (option as any).label;
  }

  return option;
}

export function useAutocompleteSearch<TOption>(
  options: MaybeRefOrGetter<readonly TOption[] | null | undefined>,
  getLabel: GetOptionLabel<TOption> = defaultGetLabel,
) {
  const filteredOptions = ref<TOption[]>([]);

  const reset = () => {
    filteredOptions.value = Array.from(toValue(options) ?? []);
  };

  watch(
    () => toValue(options),
    () => {
      reset();
    },
    { immediate: true },
  );

  const filterFn: AutocompleteFilterFn = (val, update) => {
    if (val === '') {
      update(() => reset());
      return;
    }

    update(() => {
      const needle = val.toLowerCase();
      filteredOptions.value = (toValue(options) ?? []).filter((option) => {
        const label = getLabel(option);
        return String(label).toLowerCase().indexOf(needle) > -1;
      });
    });
  };

  return { filterFn, filteredOptions };
}
