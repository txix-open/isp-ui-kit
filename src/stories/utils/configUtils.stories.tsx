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
  parameters: {
    docs: {
      description: {
        component: `
Возвращает значение из конфига проекта. Если значение не будет найдено вернется значение по умолчанию
\`\`\`tsx
import { getConfigProperty } from 'isp-ui-kit'

const passwordLoginEnabled = getConfigProperty('ENABLE_PASSWORD_LOGIN', true)
\`\`\`
        `,
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
      description:
        'Значение по умолчанию, которое вернется если ключ в конфиге отсутствует',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfigDemo>;

export const DefaultBehavior: Story = {
  args: {
    property: 'ключ свойства',
    defaultValue: 'default_value',
  },
};

export const PropertyExists: Story = {
  args: {
    property: 'featureToggle',
    defaultValue: false,
  },
};

export const PropertyAbsent: Story = {
  args: {
    property: 'nonExistentProp',
    defaultValue: [1, 2, 3],
  },
};

export const ComplexDataTypes: Story = {
  args: {
    property: 'complexObject',
    defaultValue: { name: 'Default', nested: { value: 100 } },
  },
};
