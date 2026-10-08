import { useState } from 'react';
import { Button, Dropdown, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import type { ColumnActionsProps } from './column.type';

type Props = Pick<
  ColumnActionsProps,
  | 'selectedItemId'
  | 'showUpdateBtn'
  | 'showRemoveBtn'
  | 'onUpdateItem'
  | 'onRemoveItem'
  | 'loadingRemove'
  | 'disableRemovePopconfirm'
  | 'removeConfirmDescription'
  | 'onOpenChange'
> & { disabled?: boolean };

export default function ColumnSelectionActions({
  disabled = false,
  selectedItemId,
  showUpdateBtn,
  showRemoveBtn,
  onUpdateItem,
  onRemoveItem,
  loadingRemove,
  disableRemovePopconfirm,
  removeConfirmDescription,
  onOpenChange,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const changeConfirmOpen = (open: boolean) => {
    setConfirmOpen(open);
    onOpenChange?.(open);
  };
  return (
    <div className="column__selection-actions">
      <Popconfirm
        open={confirmOpen}
        trigger={[]}
        title="Удалить выбранный элемент?"
        description={removeConfirmDescription}
        onOpenChange={changeConfirmOpen}
        onConfirm={() => onRemoveItem(selectedItemId)}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true, loading: loadingRemove }}
      >
        <Dropdown
          trigger={['click']}
          disabled={disabled || loadingRemove}
          placement="bottomRight"
          menu={{
            items: [
              ...(showUpdateBtn
                ? [
                    {
                      key: 'edit',
                      label: 'Редактировать',
                      icon: <EditOutlined />,
                      disabled: loadingRemove,
                    },
                  ]
                : []),
              ...(showRemoveBtn
                ? [
                    {
                      key: 'remove',
                      label: 'Удалить',
                      icon: <DeleteOutlined />,
                      danger: true,
                      disabled: loadingRemove,
                    },
                  ]
                : []),
            ],
            onClick: ({ key }) => {
              if (key === 'edit') onUpdateItem(selectedItemId);
              if (key === 'remove') {
                if (disableRemovePopconfirm) onRemoveItem(selectedItemId);
                else changeConfirmOpen(true);
              }
            },
          }}
        >
          <Button
            type="text"
            size="small"
            aria-label="Действия с выбранным элементом"
            title={
              disabled
                ? 'Выберите элемент для действий'
                : 'Действия с выбранным элементом'
            }
            icon={<MoreOutlined />}
            loading={loadingRemove}
            disabled={disabled}
          />
        </Dropdown>
      </Popconfirm>
    </div>
  );
}
