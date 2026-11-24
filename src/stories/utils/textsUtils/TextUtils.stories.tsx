import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  createTextGetter,
  createTextVerifier,
  type TextDictionary,
} from '../../../utils/textsUtils';
import { texts } from './texts.mock';

const meta: Meta = {
  title: 'Utils/TextUtils',
  parameters: {
    docs: {
      description: {
        component:
          'Получение текстов и подстановка строковых параметров. Словарь хранится в приложении; пустой текст и отсутствие ключа имеют разные правила fallback. [Контракты и примеры подключения](?path=/docs/utils-textutils-описание--docs).',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const BasicGetText: Story = {
  name: 'Базовое использование',
  render: () => {
    const getText = createTextGetter(texts);

    return <div>{getText('table.empty')}</div>;
  },
};

export const WithParams: Story = {
  name: 'Использование с параметрами',
  render: () => {
    const getText = createTextGetter(texts);

    return (
      <div>
        {getText('finishPage.deputyLength', '', {
          firstDeputy: 'Иванов И.И.',
          deputiesLength: String(3),
        })}
      </div>
    );
  },
};

export const Fallback: Story = {
  name: 'Текст по умолчанию',
  render: () => {
    const getText = createTextGetter(undefined);

    return <div>{getText('table.empty', 'Fallback текст')}</div>;
  },
};

export const VerifyKey: Story = {
  name: 'Проверка наличия ключа',
  render: () => {
    const verify = createTextVerifier<TextDictionary>({
      ...texts,
      'table.note': '',
    });

    return (
      <ul>
        <li>table.empty: {String(verify('table.empty'))}</li>
        <li>unknown.key: {String(verify('unknown.key'))}</li>
        <li>table.note (пустая строка): {String(verify('table.note'))}</li>
      </ul>
    );
  },
};

import { createContext, useContext } from 'react';

const TextsContext = createContext<{
  getText: ReturnType<typeof createTextGetter>;
} | null>(null);

export const WithContext: Story = {
  name: 'Использование с Context',
  render: () => {
    const getText = createTextGetter(texts);

    return (
      <TextsContext.Provider value={{ getText }}>
        <Child />
      </TextsContext.Provider>
    );
  },
};

const Child = () => {
  const ctx = useContext(TextsContext);
  if (!ctx) return null;

  return <div>{ctx.getText('table.empty')}</div>;
};
