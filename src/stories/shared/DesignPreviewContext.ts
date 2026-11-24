import { createContext, useContext } from 'react';

export const DesignPreviewContext = createContext({
  theme: 'light',
  height: 'normal',
  width: 'full',
  setTheme: (_value: string) => {},
});
export const useDesignPreview = () => useContext(DesignPreviewContext);
