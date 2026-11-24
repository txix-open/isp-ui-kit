import { useGlobals } from 'storybook/preview-api';
import { DesignPreviewContext } from '../src/stories/shared/DesignPreviewContext';
import { useId } from 'react';
import { ConfigProvider, theme } from 'antd';
import type { Decorator } from '@storybook/react-vite';

const lightButtonColors = {
  colorPrimary: '#0965D6',
  colorPrimaryHover: '#0D6BE5',
  colorPrimaryActive: '#095CC4',
  colorPrimaryBorder: '#0965D6',
};

const darkButtonColors = { colorPrimaryHover: '#2171DC' };

export const withDesignPreview: Decorator = (Story, context) => {
  const [, updateGlobals] = useGlobals();
  const key = `kit-preview-${useId().replace(/:/g, '')}`;
  const supported = /^(Layout|Components|FormComponents|Редизайн)\//.test(
    context.title,
  );
  if (
    !supported ||
    context.title.startsWith('PcsKit/') ||
    context.parameters.designPreview === false
  )
    return <Story />;
  const dark = context.globals.kitTheme === 'dark';
  const width =
    context.globals.kitWidth === 'narrow'
      ? 360
      : context.globals.kitWidth === 'tablet'
        ? 768
        : undefined;
  return (
    <DesignPreviewContext.Provider
      value={{
        theme: context.globals.kitTheme,
        height: context.globals.kitHeight,
        width: context.globals.kitWidth,
        setTheme: (value) => updateGlobals({ kitTheme: value }),
      }}
    >
      <ConfigProvider
        theme={{
          cssVar: { key },
          algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          components: { Button: dark ? darkButtonColors : lightButtonColors },
        }}
      >
        <div
          className={key}
          style={{
            boxSizing: 'border-box',
            width: width ?? '100%',
            maxWidth: '100%',
            minWidth: 0,
            padding: 16,
            colorScheme: dark ? 'dark' : 'light',
            background: 'var(--ant-color-bg-layout, #f4f6fa)',
            color: 'var(--ant-color-text, #17243b)',
            fontFamily: 'var(--ant-font-family, sans-serif)',
          }}
        >
          <Story />
        </div>
      </ConfigProvider>
    </DesignPreviewContext.Provider>
  );
};
