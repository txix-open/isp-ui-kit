import { createContext, useContext } from 'react';

export const DesignPreviewContext = createContext({
  theme: 'light',
  height: 'normal',
  setTheme: (_value: string) => {},
});
export const useDesignPreview = () => useContext(DesignPreviewContext);
