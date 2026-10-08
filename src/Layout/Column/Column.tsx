import { Button, Empty, Popover, Skeleton } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  createRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import 'react-resizable/css/styles.css';
import { ResizableBox } from 'react-resizable';
import { ColumnItem, ColumnProps } from './column.type';
import ColumnHeaderTitle from './ColumnHeaderTitle';
import ColumnActions from './ColumnActions';
import ColumnSelectionActions from './ColumnSelectionActions';
import ColumnSortControls from './ColumnSortControls';
import ColumnContent from './ColumnContent';
import { toStorageKey } from './column.utils';
import { useColumnGrouping } from './useColumnGrouping';
import './column.scss';
import './column-modern.scss';
import ColumnSearchControls from './ColumnSearchControls';

const Column = <T extends object>({
  appearance = 'modern',
  totalItemsCount,
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
  isCollapsible = true,
  searchFields = [],
  searchFieldValue,
  onChangeSearchField = () => {},
}: ColumnProps<T>) => {
  const DEFAULT_COLUMN_WIDTH = 300;
  const COLLAPSED_WIDTH = 0;
  const MIN_COLUMN_WIDTH = 200;
  const isDisabled = !selectedItemId;
  const refs = useRef<Record<string, RefObject<HTMLDivElement | null>>>({});
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const getItemRef = (id: string | number) => {
    const key = String(id);
    if (!refs.current[key]) {
      refs.current[key] = createRef<HTMLDivElement>();
    }
    return refs.current[key];
  };
  const [currentColumnWidth, setCurrentColumnWidth] =
    useState<number>(DEFAULT_COLUMN_WIDTH);
  const [lastExpandedWidth, setLastExpandedWidth] =
    useState<number>(DEFAULT_COLUMN_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const isCollapsed = currentColumnWidth === COLLAPSED_WIDTH;

  const sortOptions = useMemo(() => {
    const defaultOption = { value: 'default', label: 'По умолчанию' };
    return sortableFields.length > 0 ? [defaultOption, ...sortableFields] : [];
  }, [sortableFields]);

  useEffect(() => {
    const storedWidth = localStorage.getItem(toStorageKey(columnKey));
    if (storedWidth) {
      const parsedWidth = Number(storedWidth);
      setCurrentColumnWidth(
        Number.isNaN(parsedWidth) ? DEFAULT_COLUMN_WIDTH : parsedWidth,
      );
    }
  }, [columnKey]);

  const setAndStoreWidth = (width: number) => {
    setCurrentColumnWidth(width);
    localStorage.setItem(toStorageKey(columnKey), width.toString());
  };

  const toggleCollapsed = () => {
    if (!isCollapsible) {
      return;
    }

    if (isCollapsed) {
      const nextWidth =
        lastExpandedWidth >= MIN_COLUMN_WIDTH
          ? lastExpandedWidth
          : DEFAULT_COLUMN_WIDTH;
      setAndStoreWidth(nextWidth);
      return;
    }

    if (currentColumnWidth >= MIN_COLUMN_WIDTH) {
      setLastExpandedWidth(currentColumnWidth);
    }
    setAndStoreWidth(COLLAPSED_WIDTH);
  };

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
    if (
      !selectedItemId ||
      isLoading ||
      isCollapsed ||
      !items.some((item) => String(item.id) === selectedItemId)
    ) {
      return;
    }
    let frame: number;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    const scrollToElement = () => {
      const currentRef = refs.current[selectedItemId];
      if (currentRef?.current) {
        timer = setTimeout(() => {
          const element = currentRef.current;
          const container = scrollRef.current;
          if (!element || !container) return;
          const elementRect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          if (
            elementRect.top < containerRect.top ||
            elementRect.bottom > containerRect.bottom
          ) {
            container.scrollTo({
              top:
                container.scrollTop +
                elementRect.top -
                containerRect.top -
                (container.clientHeight - elementRect.height) / 2,
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
                .matches
                ? 'instant'
                : 'smooth',
            });
          }
        }, 300);
      } else if (attempts++ < 60) {
        frame = requestAnimationFrame(scrollToElement);
      }
    };

    scrollToElement();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [selectedItemId, isLoading, isCollapsed, items]);

  const handleSortChange = (value: string) => {
    if (value === 'default') {
      onChangeSortValue?.(undefined);
      onChangeDirectionValue?.(undefined);
    } else {
      onChangeSortValue?.(value as keyof T);
      onChangeDirectionValue?.(directionValue || 'asc');
    }
  };

  const handleSearchChange = (value: string) => {
    onChangeSearchField(value);
  };

  const checkIsActive = (id: string | number): boolean =>
    id.toString() === selectedItemId;

  const renderItem = (item: ColumnItem<T>) =>
    appearance === 'modern' ? (
      <div
        ref={getItemRef(item.id)}
        key={item.id}
        className={`column__items__item ${checkIsActive(item.id) ? 'active' : ''}`}
      >
        <div
          className="column__item-select"
          role="button"
          tabIndex={0}
          aria-pressed={checkIsActive(item.id)}
          data-cy="firstColumnItem"
          onClick={() => setSelectedItemId(String(item.id))}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedItemId(String(item.id));
            }
          }}
        >
          <Skeleton loading={isLoading} active>
            {renderItems(item)}
          </Skeleton>
        </div>
      </div>
    ) : (
      <div
        tabIndex={0}
        role="button"
        aria-pressed={checkIsActive(item.id)}
        data-cy="firstColumnItem"
        ref={getItemRef(item.id)}
        key={item.id}
        className={`column__items__item ${
          checkIsActive(item.id) ? 'active' : ''
        }`}
        onClick={() => setSelectedItemId(item.id.toString())}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedItemId(item.id.toString());
          }
        }}
      >
        <Skeleton loading={isLoading} active>
          {renderItems(item)}
        </Skeleton>
      </div>
    );

  return (
    <ResizableBox
      minConstraints={[isCollapsed ? COLLAPSED_WIDTH : MIN_COLUMN_WIDTH, 0]}
      className={`column ${appearance === 'modern' ? 'column--modern' : ''} ${isCollapsed ? 'collapsed' : ''} ${
        isResizing ? 'resizing' : ''
      }`}
      width={currentColumnWidth}
      resizeHandles={['e']}
      axis="x"
      data-cy="firstColumn"
      handle={
        <span
          className="custom-resize-handle"
          role="separator"
          tabIndex={0}
          aria-label="Ширина колонки"
          aria-orientation="vertical"
          aria-valuenow={currentColumnWidth}
          aria-valuemin={isCollapsed ? 0 : MIN_COLUMN_WIDTH}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleCollapsed();
            } else if (
              !isCollapsed &&
              (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
            ) {
              e.preventDefault();
              const width = Math.max(
                MIN_COLUMN_WIDTH,
                currentColumnWidth + (e.key === 'ArrowRight' ? 20 : -20),
              );
              setAndStoreWidth(width);
              setLastExpandedWidth(width);
            }
          }}
        >
          <span className="custom-resize-handle__thumb" />
          {isCollapsible && (
            <button
              type="button"
              className="custom-resize-handle__toggle"
              aria-label={
                isCollapsed ? 'Развернуть колонку' : 'Свернуть колонку'
              }
              aria-expanded={!isCollapsed}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapsed();
              }}
            >
              {isCollapsed ? <RightOutlined /> : <LeftOutlined />}
            </button>
          )}
        </span>
      }
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={(_, { size }) => {
        setIsResizing(false);
        setAndStoreWidth(size.width);
        if (size.width >= MIN_COLUMN_WIDTH) {
          setLastExpandedWidth(size.width);
        }
      }}
    >
      <div className="column__header" inert={isCollapsed}>
        <ColumnHeaderTitle
          appearance={appearance}
          showAddBtn={showAddBtn}
          onAddItem={onAddItem}
          selectionActions={
            appearance === 'modern' && (showUpdateBtn || showRemoveBtn) ? (
              <ColumnSelectionActions
                key={selectedItemId}
                selectedItemId={selectedItemId}
                disabled={isDisabled || Boolean(isLoading)}
                showUpdateBtn={showUpdateBtn}
                showRemoveBtn={showRemoveBtn}
                onUpdateItem={onUpdateItem}
                onRemoveItem={onRemoveItem}
                loadingRemove={loadingRemove}
                disableRemovePopconfirm={disableRemovePopconfirm}
                removeConfirmDescription={removeConfirmDescription}
                onOpenChange={onOpenChange}
              />
            ) : undefined
          }
          totalItemsCount={totalItemsCount}
          isSearching={Boolean(searchValue?.trim())}
          title={title}
          extraTitle={extraTitle}
          tooltipTitle={tooltipTitle}
          itemsCount={items.length}
        />
        <ColumnActions
          appearance={appearance}
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
        {appearance === 'modern' ? (
          <div className="column__modern-options">
            <ColumnSortControls
              sortableFields={sortableFields}
              sortValue={sortValue}
              directionValue={directionValue}
              sortOptions={sortOptions}
              onChangeDirectionValue={onChangeDirectionValue}
              onSortChange={handleSortChange}
            />
            {searchFields.length > 0 && (
              <Popover
                trigger="click"
                placement="bottomRight"
                title="Поле поиска"
                content={
                  <div style={{ width: 220 }}>
                    <ColumnSearchControls
                      searchFields={searchFields}
                      searchFieldValue={searchFieldValue}
                      searchOptions={searchFields}
                      onSearchChange={handleSearchChange}
                    />
                  </div>
                }
              >
                <Button
                  type="text"
                  size="small"
                  aria-label="Настройки поиска"
                  title="Настройки поиска"
                  icon={<SettingOutlined />}
                />
              </Popover>
            )}
          </div>
        ) : (
          <>
            <ColumnSearchControls
              searchFields={searchFields}
              searchFieldValue={searchFieldValue}
              searchOptions={searchFields}
              onSearchChange={handleSearchChange}
            />
            <ColumnSortControls
              sortableFields={sortableFields}
              sortValue={sortValue}
              directionValue={directionValue}
              sortOptions={sortOptions}
              onChangeDirectionValue={onChangeDirectionValue}
              onSortChange={handleSortChange}
            />
          </>
        )}
      </div>
      <SimpleBar
        className="column__items"
        inert={isCollapsed}
        scrollableNodeProps={{ ref: scrollRef }}
      >
        {appearance === 'modern' && !isLoading && items.length === 0 && (
          <div className="column__empty" role="status">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                searchValue ? 'Ничего не найдено' : 'Пока нет элементов'
              }
            />
            <p>
              {searchValue
                ? 'Попробуйте изменить запрос или поле поиска.'
                : 'Добавьте первый элемент, чтобы начать работу.'}
            </p>
            {!searchValue && showAddBtn && (
              <Button onClick={onAddItem}>Добавить элемент</Button>
            )}
          </div>
        )}
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
