import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { PcsButton, PcsModal, PcsTextAreaField } from '../../PcsKit';

import './pcs-kit-storybook.scss';

const meta: Meta = {
  title: 'PcsKit/Modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'PcsModal — обертка над Ant Design Modal с PCS-разметкой заголовка, описания и footer.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const DefaultModal: Story = {
  name: 'Обычное окно',
  render: () => {
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState(
      'Проверить параметры перед запуском.',
    );

    return (
      <>
        <PcsButton variant="lightblue" onClick={() => setOpen(true)}>
          Открыть окно
        </PcsButton>
        <PcsModal
          open={open}
          title="Настройка действия"
          description="Модальное окно принимает произвольный контент и footer."
          footer={
            <>
              <PcsButton variant="silver" onClick={() => setOpen(false)}>
                Отмена
              </PcsButton>
              <PcsButton variant="lightblue" onClick={() => setOpen(false)}>
                Сохранить
              </PcsButton>
            </>
          }
          onClose={() => setOpen(false)}
        >
          <PcsTextAreaField
            label="Комментарий"
            rows={4}
            value={comment}
            onChange={setComment}
          />
        </PcsModal>
      </>
    );
  },
};

export const ConfirmModal: Story = {
  name: 'Подтверждение',
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <PcsButton variant="redNegative" onClick={() => setOpen(true)}>
          Открыть подтверждение
        </PcsButton>
        <PcsModal
          open={open}
          title="Удалить выбранные записи?"
          description="Действие нельзя отменить после подтверждения."
          footerLayout="equal"
          variant="confirm"
          width={560}
          footer={
            <>
              <PcsButton variant="silver" onClick={() => setOpen(false)}>
                Отмена
              </PcsButton>
              <PcsButton variant="redNegative" onClick={() => setOpen(false)}>
                Удалить
              </PcsButton>
            </>
          }
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};
