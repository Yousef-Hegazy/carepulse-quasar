import { defineBoot } from '#q-app/wrappers';
import { type ComponentConstructor, QBtn, QFile, QInput, QRadio, QSelect } from 'quasar';

type ExtractComponentProps<T> = T extends ComponentConstructor<infer X> ? X['$props'] : never;
const setDefaults = <
  T extends ComponentConstructor
>(
  component: T,
  propDefaults: {
    [K in keyof Partial<ExtractComponentProps<T>>]: ExtractComponentProps<T>[K];
  }
) => {
  for (const key in propDefaults) {
    const prop = component.props[key];
    switch (typeof prop) {
      case 'object':
        prop.default = propDefaults[key];
        break;
      case 'function':
        component.props[key] = {
          type: prop,
          default: propDefaults[key]
        };
        break;
      case 'undefined':
        throw new Error('unknown prop: ' + key);
      default:
        throw new Error('unhandled type: ' + typeof prop);
    }
  }
};

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(() => {
  setDefaults(QBtn, {
    unelevated: true,
    noCaps: true,
    ripple: true,
    size: 'md',
    dense: false,
    type: 'button',
  });

  setDefaults(QSelect, {
    outlined: true,
    noErrorIcon: true,
    useInput: true,
    fillInput: true,
    hideSelected: false,
    emitValue: true,
    mapOptions: true,
  });

  setDefaults(QInput, {
    outlined: true,
    noErrorIcon: true,
  });
  
  setDefaults(QFile, {
    outlined: true,
    noErrorIcon: true,
  });

  setDefaults(QRadio, {
    size: 'sm',
  });
});