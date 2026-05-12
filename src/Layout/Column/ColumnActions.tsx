import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Space } from 'antd';
import { ColumnActionsProps } from './column.type';
import SearchInput from '../../components/SearchInput/SearchInput';

const ColumnActions = ({
  searchPlaceholder,
  searchValue,
  onChangeSearchValue,
  showAddBtn,
  showUpdateBtn,
  showRemoveBtn,
  isDisabled,
  selectedItemId,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  loadingRemove,
  disableRemovePopconfirm,
  removeConfirmDescription,
  onOpenChange,
}: ColumnActionsProps) => (
  <div className="column__header__actions">
    <SearchInput
      placeholder={searchPlaceholder}
      data-cy="searchInput"
      value={searchValue}
      onChange={(e) => onChangeSearchValue(e.target.value, e)}
    />
    <Space.Compact block className="button_group">
      {showAddBtn && (
        <Button
          data-cy="onAddItem"
          onClick={onAddItem}
          icon={<PlusSquareOutlined />}
        />
      )}
      {showUpdateBtn && (
        <Button
          data-cy="showUpdateBtn"
          disabled={isDisabled}
          onClick={() => onUpdateItem(selectedItemId)}
          icon={<EditOutlined />}
        />
      )}
      {showRemoveBtn &&
        (disableRemovePopconfirm ? (
          <Button
            loading={loadingRemove}
            data-cy="removeItem"
            disabled={isDisabled}
            onClick={() => onRemoveItem(selectedItemId)}
            icon={<DeleteOutlined />}
          />
        ) : (
          <Popconfirm
            disabled={isDisabled}
            onConfirm={() => onRemoveItem(selectedItemId)}
            title="Вы действительно хотите удалить этот элемент?"
            description={removeConfirmDescription}
            onOpenChange={onOpenChange}
          >
            <Button
              loading={loadingRemove}
              data-cy="removeItem"
              disabled={isDisabled}
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        ))}
    </Space.Compact>
  </div>
);

export default ColumnActions;
