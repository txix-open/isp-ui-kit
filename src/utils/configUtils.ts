declare global {
  interface Window {
    config: { [key: string]: any };
  }
}

export const getConfigProperty = (property: string, defaultValue: any) =>
  window.config && Object.hasOwn(window.config, property)
    ? window.config[property]
    : defaultValue;
