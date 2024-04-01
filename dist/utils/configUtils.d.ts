declare global {
  interface Window {
    config: {
      [key: string]: any;
    };
  }
}
export declare const getConfigProperty: (
  property: string,
  defaultValue: any,
) => any;
