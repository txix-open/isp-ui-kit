import { Tooltip } from 'antd';
import { ColumnHeaderTitleProps } from './column.type';
import { pluralize } from '../../utils/columnUtils';

const ColumnHeaderTitle = ({
  title,
  extraTitle,
  tooltipTitle,
  itemsCount,
}: ColumnHeaderTitleProps) => {
  if (!title) {
    return null;
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
