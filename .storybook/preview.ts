import type { Preview } from '@storybook/react-vite';
import { withDesignPreview } from './DesignPreview';

const preview: Preview = {
  decorators: [withDesignPreview],
  initialGlobals: { kitTheme: 'light', kitWidth: 'full', kitHeight: 'normal' },
  globalTypes: {
    kitTheme: {
      description: 'Тема примеров UI-кита (кроме PcsKit)',
      toolbar: {
        title: 'Тема',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Светлая' },
          { value: 'dark', title: 'Тёмная' },
        ],
      },
    },
    kitWidth: {
      description: 'Ширина области примера',
      toolbar: {
        title: 'Ширина',
        icon: 'browser',
        dynamicTitle: true,
        items: [
          { value: 'full', title: 'Вся ширина' },
          { value: 'tablet', title: '768 px' },
          { value: 'narrow', title: '360 px' },
        ],
      },
    },
    kitHeight: {
      description: 'Высота рабочих областей ThreeColumns',
      toolbar: {
        title: 'Высота',
        icon: 'expand',
        dynamicTitle: true,
        items: [
          { value: 'short', title: '320 px' },
          { value: 'normal', title: '560 px' },
          { value: 'tall', title: '720 px' },
        ],
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: [
          'Введение',
          'Редизайн',
          ['Обзор', 'Переход на обновлённый кит', 'Column'],
          'Layout',
          [
            'Описание',
            'ThreeColumns',
            ['Обзор', 'Column', 'NoData', 'EmptyData', 'Состояния'],
            'Pages',
          ],
          'Components',
          'FormComponents',
          ['Описание', 'ConfigForm'],
          'Hooks',
          'Utils',
          '*',
        ],
      },
    },
  },
};

export default preview;
