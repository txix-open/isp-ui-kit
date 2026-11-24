import { useLayoutEffect, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { getConfigProperty } from '../../utils/configUtils';

const ConfigDemo = ({
  property,
  defaultValue,
}: {
  property: string;
  defaultValue: unknown;
}) => {
  const value = getConfigProperty(property, defaultValue);
  return (
    <div>
      <h3>{property}</h3>
      <pre>
        {value === undefined ? 'undefined' : JSON.stringify(value, null, 2)}
      </pre>
      <p>Тип: {typeof value}</p>
    </div>
  );
};

const fixture = {
  featureToggle: true,
  disabledFeature: false,
  emptyText: '',
  zero: 0,
  nullable: null,
  explicitUndefined: undefined,
  complexObject: { name: 'Real', nested: { value: 42 } },
};

let fixtureUsers = 0;
let previousConfig: Window['config'];
let hadConfig = false;

const ConfigFixture = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    if (fixtureUsers++ === 0) {
      hadConfig = Object.hasOwn(window, 'config');
      previousConfig = window.config;
      window.config = fixture;
    }
    setReady(true);
    return () => {
      if (--fixtureUsers === 0) {
        if (hadConfig) window.config = previousConfig;
        else Reflect.deleteProperty(window, 'config');
      }
    };
  }, []);
  return ready ? children : null;
};

const meta: Meta<typeof ConfigDemo> = {
  title: 'Utils/getConfigProperty',
  component: ConfigDemo,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ConfigFixture>
        <Story />
      </ConfigFixture>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Читает собственное свойство window.config по точному ключу. Возвращает defaultValue только при отсутствии config или свойства; false, 0, пустая строка, null и явно записанный undefined сохраняются. Вложенные пути не разбираются, тип не проверяется, подписки нет. При отсутствии window возвращает defaultValue, в том числе при серверном рендеринге.\n\nПриложение заполняет window.config до чтения. Пример: getConfigProperty("ENABLE_PASSWORD_LOGIN", true). В историях используется локальная конфигурация, которая восстанавливается после закрытия примера.',
      },
    },
  },
  argTypes: {
    property: {
      control: 'text',
      description:
        'Точный ключ собственного свойства window.config; точка не означает вложенный путь.',
    },
    defaultValue: {
      control: 'object',
      description:
        'Любое значение, возвращаемое только при отсутствии config или ключа.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfigDemo>;

export const Example: Story = {
  name: 'Пример',
  args: {
    property: 'sampleKey',
    defaultValue: 'default_value',
  },
};

export const PropertyExists: Story = {
  name: 'Свойство существует',
  args: {
    property: 'featureToggle',
    defaultValue: 'default_value',
  },
};

export const PropertyAbsent: Story = {
  name: 'Свойство отсутствует',
  args: {
    property: 'nonExistentProp',
    defaultValue: [1, 2, 3],
  },
};

export const ComplexDataTypes: Story = {
  name: 'Сложные данные',
  args: {
    property: 'complexObject',
    defaultValue: { name: 'Default', nested: { value: 100 } },
  },
};

export const FalsyValues: Story = {
  name: 'false, 0, пустая строка, null и undefined',
  args: { property: 'disabledFeature', defaultValue: 'fallback' },
  render: () => (
    <div>
      {[
        'disabledFeature',
        'zero',
        'emptyText',
        'nullable',
        'explicitUndefined',
      ].map((property) => (
        <ConfigDemo
          key={property}
          property={property}
          defaultValue="fallback"
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Все пять ключей существуют: fallback не используется. undefined выводится явно, чтобы отличить его от пустой строки.',
      },
    },
  },
};
