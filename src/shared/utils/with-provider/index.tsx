import {type ComponentType } from 'react';

export function withProvider<P extends object>(
  ProviderComponent: ComponentType<P>,
  staticProviderProps: Partial<P> = {},
) {
  return function wrapWithProvider<W extends object>(
    WrappedComponent: ComponentType<W>
  ) {
    return function ProviderWrapper(props: W) {
      return (
        <ProviderComponent {...staticProviderProps as P}>
          <WrappedComponent {...props} />
        </ProviderComponent>
      );
    };
  };
}