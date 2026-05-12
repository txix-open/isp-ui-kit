import { Skeleton } from 'antd';
import {
  createRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import SimpleBar from 'simplebar-react';
import { ResizableBox } from 'react-resizable';
import { ColumnItem, ColumnProps } from './column.type';
import ColumnHeaderTitle from './ColumnHeaderTitle';
import ColumnActions from './ColumnActions';
import ColumnSortControls from './ColumnSortControls';
import ColumnContent from './ColumnContent';
import { toStorageKey } from './column.utils';
import { useColumnGrouping } from './useColumnGrouping';
import './column.scss';

const Column = <T extends object>({
  title = '',
  extraTitle,
  tooltipTitle,
  searchPlaceholder = 'Найти элемент',
  items = [],
  onAddItem = () => {},
  onUpdateItem = () => {},
  onRemoveItem = () => {},
  showRemoveBtn = true,
  showUpdateBtn = true,
  showAddBtn = true,
  sortableFields = [],
  selectedItemId,
  setSelectedItemId,
  searchValue,
  onChangeSearchValue,
  renderItems,
  columnKey,
  sortValue,
  onChangeSortValue,
  directionValue,
  onChangeDirectionValue,
  loadingRemove = false,
  groupBy,
  renderHeaderGroup,
  sortGroups,
  isLoading,
  removeConfirmDescription = null,
  onOpenChange = undefined,
  disableRemovePopconfirm = false,
}: ColumnProps<T>) => {
  const isDisabled = !selectedItemId;
  const refs = useRef<Record<string, RefObject<HTMLDivElement | null>>>({});
  const getItemRef = (id: string | number) => {
    const key = String(id);
    if (!refs.current[key]) {
      refs.current[key] = createRef<HTMLDivElement>();
    }
    return refs.current[key];
  };
  const [currentColumnWidth, setCurrentColumnWidth] = useState<number>(300);

  const sortOptions = useMemo(() => {
    const defaultOption = { value: 'default', label: 'По умолчанию' };
    return sortableFields.length > 0 ? [defaultOption, ...sortableFields] : [];
  }, [sortableFields]);

  useEffect(() => {
    const storedWidth = localStorage.getItem(toStorageKey(columnKey));
    if (storedWidth) {
      setCurrentColumnWidth(Number(storedWidth));
    }
  }, [columnKey]);

  const {
    shouldShowGroups,
    sortedGroupedItems,
    activeGroupKeys,
    handleCollapseChange,
  } = useColumnGrouping({
    items,
    groupBy,
    searchValue,
    selectedItemId,
    sortValue,
    directionValue,
    sortGroups,
  });

  useEffect(() => {
    if (!selectedItemId || isLoading) {
      return;
    }

    const scrollToElement = () => {
      const currentRef = refs.current[selectedItemId];
      if (currentRef?.current) {
        setTimeout(() => {
          currentRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }, 300);
      } else {
        requestAnimationFrame(scrollToElement);
      }
    };

    scrollToElement();
  }, [selectedItemId, isLoading]);

  const handleSortChange = (value: string) => {
    if (value === 'default') {
      onChangeSortValue?.(undefined);
      onChangeDirectionValue?.(undefined);
    } else {
      onChangeSortValue?.(value as keyof T);
      onChangeDirectionValue?.(directionValue || 'asc');
    }
  };

  const checkIsActive = (id: string | number): boolean =>
    id.toString() === selectedItemId;

  const renderItem = (item: ColumnItem<T>) => (
    <div
      aria-hidden="true"
      tabIndex={0}
      role="button"
      data-cy="firstColumnItem"
      ref={getItemRef(item.id)}
      key={item.id}
      className={`column__items__item ${
        checkIsActive(item.id) ? 'active' : ''
      }`}
      onClick={() => setSelectedItemId(item.id.toString())}
      onKeyDown={(e) =>
        e.key === 'Enter' && setSelectedItemId(item.id.toString())
      }
    >
      <Skeleton loading={isLoading} active>
        {renderItems(item)}
      </Skeleton>
    </div>
  );

  return (
    <ResizableBox
      minConstraints={[300, 0]}
      className="column"
      width={currentColumnWidth}
      resizeHandles={['e']}
      axis="x"
      data-cy="firstColumn"
      handle={<span className="custom-resize-handle" />}
      onResizeStop={(_, { size }) => {
        setCurrentColumnWidth(size.width);
        localStorage.setItem(toStorageKey(columnKey), size.width.toString());
      }}
    >
      <div className="column__header">
        <ColumnHeaderTitle
          title={title}
          extraTitle={extraTitle}
          tooltipTitle={tooltipTitle}
          itemsCount={items.length}
        />
        <ColumnActions
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onChangeSearchValue={onChangeSearchValue}
          showAddBtn={showAddBtn}
          showUpdateBtn={showUpdateBtn}
          showRemoveBtn={showRemoveBtn}
          isDisabled={isDisabled}
          selectedItemId={selectedItemId}
          onAddItem={onAddItem}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
          loadingRemove={loadingRemove}
          disableRemovePopconfirm={disableRemovePopconfirm}
          removeConfirmDescription={removeConfirmDescription}
          onOpenChange={onOpenChange}
        />
        <ColumnSortControls
          sortableFields={sortableFields}
          sortValue={sortValue}
          directionValue={directionValue}
          sortOptions={sortOptions}
          onChangeDirectionValue={onChangeDirectionValue}
          onSortChange={handleSortChange}
        />
      </div>
      <SimpleBar className="column__items">
        <ColumnContent
          shouldShowGroups={shouldShowGroups}
          sortedGroupedItems={sortedGroupedItems}
          activeGroupKeys={activeGroupKeys}
          onCollapseChange={handleCollapseChange}
          renderHeaderGroup={renderHeaderGroup}
          renderItem={renderItem}
          isLoading={isLoading}
          hasItems={items.length > 0}
        />
      </SimpleBar>
    </ResizableBox>
  );
};

export default Column;
