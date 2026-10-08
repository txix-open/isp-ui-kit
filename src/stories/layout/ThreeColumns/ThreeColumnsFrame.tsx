import { useDesignPreview } from '../../shared/DesignPreviewContext';
import type { ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';

export default function ThreeColumnsFrame({
  children,
  dark,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  const preview = useDesignPreview();
  const isDark = dark ?? preview.theme === 'dark';
  const height =
    preview.height === 'short' ? 320 : preview.height === 'tall' ? 720 : 560;
  return (
    <ConfigProvider
      theme={{
        cssVar: { key: 'three-columns-preview' },
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div
        className="three-columns-preview"
        style={{
          display: 'flex',
          gap: 16,
          height,
          minHeight: 280,
          padding: 16,
          boxSizing: 'border-box',
          overflow: 'auto',
          background: 'var(--ant-color-bg-layout, #f4f6fa)',
          fontFamily: 'var(--ant-font-family, sans-serif)',
        }}
      >
        {children}
      </div>
    </ConfigProvider>
  );
}
