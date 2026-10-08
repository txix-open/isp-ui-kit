import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { ColumnHeaderTitleProps } from './column.type';
import { pluralize } from '../../utils/columnUtils';

const ColumnHeaderTitle = ({
  appearance = 'classic',
  showAddBtn,
  selectionActions,
  onAddItem,
  totalItemsCount,
  isSearching,
  title,
  extraTitle,
  tooltipTitle,
  itemsCount,
}: ColumnHeaderTitleProps) => {
  if (
    !title &&
    !(appearance === 'modern' && (showAddBtn || selectionActions))
  ) {
    return null;
  }

  if (appearance === 'modern') {
    return (
      <div className="column__modern-heading">
        <div className="column__modern-title-row">
          {typeof title === 'string' || typeof title === 'number' ? (
            <Tooltip title={tooltipTitle || title} mouseEnterDelay={0.6}>
              <h3 className="column__header__wrap__text__title">{title}</h3>
            </Tooltip>
          ) : (
            <div className="column__header__wrap__text__title">{title}</div>
          )}
          <span
            className="column__modern-count"
            aria-label={`${itemsCount} элементов`}
          >
            {itemsCount}
          </span>
          <div className="column__modern-heading-actions">
            {showAddBtn && (
              <Button
                type="primary"
                size="small"
                aria-label="Добавить элемент"
                title="Добавить элемент"
                data-cy="onAddItem"
                icon={<PlusOutlined />}
                onClick={onAddItem}
              />
            )}
            {selectionActions}
          </div>
        </div>
        {isSearching && (
          <div className="column__modern-results" role="status">
            Найдено {itemsCount}
            {totalItemsCount !== undefined ? ` из ${totalItemsCount}` : ''}
          </div>
        )}
        {extraTitle && <div className="column__modern-extra">{extraTitle}</div>}
      </div>
    );
  }

  return (
    <div className="column__header__wrap">
      <div className="column__header__wrap__text">
        <Tooltip
          placement="topLeft"
          title={tooltipTitle ? tooltipTitle : title}
          mouseEnterDelay={1}
        >
          <h3 className="column__header__wrap__text__title">{title}</h3>
        </Tooltip>
        {extraTitle && (
          <div className="column__header__wrap__text__extra">{extraTitle}</div>
        )}
      </div>
      {itemsCount > 0 && (
        <span className="column__header__wrap__count">
          {itemsCount +
            ' ' +
            pluralize(itemsCount, ['элемент', 'элемента', 'элементов'])}
        </span>
      )}
    </div>
  );
};

export default ColumnHeaderTitle;
