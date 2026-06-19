import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  PcsBottomMenu,
  PcsButton,
  PcsCheckbox,
  PcsCheckboxGroup,
  PcsIconButton,
  PcsRadioGroup,
  PcsToggle,
} from '../../PcsKit';

import './pcs-kit-storybook.scss';

const meta: Meta = {
  title: 'PcsKit/Actions',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Компоненты действий PcsKit: кнопки, иконки, переключатели, чекбоксы, радиогруппы и нижнее меню.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const buttonVariants = [
  'white',
  'silver',
  'lightblue',
  'lightgray',
  'green',
  'greenNegative',
  'redNegative',
  'pink',
  'orange',
  'transparent',
  'link',
] as const;

export const ButtonVariants: Story = {
  name: 'Кнопки',
  render: () => (
    <div style={{ display: 'flex', maxWidth: 760, flexWrap: 'wrap', gap: 12 }}>
      {buttonVariants.map((variant) => (
        <PcsButton key={variant} variant={variant}>
          {variant}
        </PcsButton>
      ))}
      <PcsButton variant="lightblue" icon={<PlusOutlined />}>
        С иконкой
      </PcsButton>
      <PcsButton variant="green" loading>
        Сохранение
      </PcsButton>
      <PcsButton variant="silver" disabled>
        Disabled
      </PcsButton>
    </div>
  ),
};

export const IconButtons: Story = {
  name: 'Иконки',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <PcsIconButton
        aria-label="Редактировать"
        icon={<EditOutlined />}
        variant="primary"
      />
      <PcsIconButton
        aria-label="Скачать"
        icon={<DownloadOutlined />}
        variant="secondary"
      />
      <PcsIconButton
        aria-label="Удалить"
        icon={<DeleteOutlined />}
        size="compact"
        variant="ghost"
      />
    </div>
  ),
};

export const SelectionControls: Story = {
  name: 'Переключатели',
  render: () => {
    const [enabled, setEnabled] = useState(true);
    const [checked, setChecked] = useState(true);
    const [groupValue, setGroupValue] = useState<string[] | undefined>([
      'email',
    ]);
    const [radioValue, setRadioValue] = useState<string | undefined>('manual');

    return (
      <div style={{ display: 'grid', maxWidth: 520, gap: 24 }}>
        <PcsToggle
          checked={enabled}
          label="Включить уведомления"
          onChange={setEnabled}
        />

        <PcsCheckbox
          checked={checked}
          label="Подтвердить действие"
          onChange={setChecked}
        />

        <PcsCheckboxGroup
          options={[
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
            { value: 'push', label: 'Push', disabled: true },
          ]}
          value={groupValue}
          onChange={setGroupValue}
        />

        <PcsRadioGroup
          options={[
            { value: 'auto', label: 'Автоматически' },
            { value: 'manual', label: 'Вручную' },
            { value: 'disabled', label: 'Недоступно', disabled: true },
          ]}
          value={radioValue}
          onChange={setRadioValue}
        />
      </div>
    );
  },
};

export const BottomMenu: Story = {
  name: 'Нижнее меню',
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <PcsBottomMenu
        placement="inline"
        actions={[
          {
            key: 'save',
            label: 'Сохранить',
            icon: <SaveOutlined />,
            onClick: () => undefined,
          },
          {
            key: 'edit',
            label: 'Редактировать',
            icon: <EditOutlined />,
            onClick: () => undefined,
          },
          {
            key: 'delete',
            label: 'Удалить',
            icon: <DeleteOutlined />,
            tooltip: 'Действие можно скрывать или отключать',
            onClick: () => undefined,
          },
        ]}
      />
    </div>
  ),
};
