import { TFunctionResult } from 'i18next';

declare module 'i18next' {
  interface TFunction {
    // basic usage
    <
      TResult extends TFunctionResult = string,
      TKeys extends TFunctionKeys = string,
      TInterpolationMap extends Record<any, any> = StringMap
    >(
      key: TKeys | TKeys[],
      options?: TOptions<TInterpolationMap> | string,
    ): TResult;
    // overloaded usage
    <
      TResult extends TFunctionResult = string,
      TKeys extends TFunctionKeys = string,
      TInterpolationMap extends Record<any, any> = StringMap
    >(
      key: TKeys | TKeys[],
      defaultValue?: string,
      options?: TOptions<TInterpolationMap> | string,
    ): TResult;
  }
}
