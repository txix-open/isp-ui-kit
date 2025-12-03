import type { Meta, StoryObj } from '@storybook/react';
import { getConfigProperty } from '../../utils/configUtils';

const ConfigDemo = ({
  property,
  defaultValue,
}: {
  property: string;
  defaultValue: any;
}) => {
  const value = getConfigProperty(property, defaultValue);
  return (
    <div>
      <h3>Результат getConfigProperty:</h3>
      <pre>{JSON.stringify(value, null, 2)}</pre>
      <p>Тип: {typeof value}</p>
    </div>
  );
};

const meta: Meta<typeof ConfigDemo> = {
  title: 'Utils/getConfigProperty',
  component: ConfigDemo,
  decorators: [
    (Story) => {
      (window as any).config = {
        featureToggle: true,
        complexObject: { name: 'Real', nested: { value: 42 } },
      };
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        component: `\nФункция возвращает значение из глобального window.config. Если ключ отсутствует, возвращается значение по умолчанию.\n\nПример:\n\n\`\`\`tsx\nimport { getConfigProperty } from 'isp-ui-kit'\n\nconst passwordLoginEnabled = getConfigProperty('ENABLE_PASSWORD_LOGIN', true)\n\`\`\`\n        `,
      },
    },
  },
  argTypes: {
    property: {
      control: 'text',
      description: 'Ключ свойства, которое необходимо получить из конфига',
    },
    defaultValue: {
      control: 'text',
      description: 'Значение по умолчанию, если ключ отсутствует',
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
