import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import {
  Button,
  List,
  Popconfirm,
  Tooltip,
  Select,
  Space,
  Collapse,
  Skeleton,
} from 'antd';
import { createRef, RefObject, useEffect, useMemo, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { ResizableBox } from 'react-resizable';
import { ColumnItem, ColumnProps } from './column.type';
import SearchInput from '../../components/SearchInput/SearchInput';
import { pluralize } from '../../utils/columnUtils';
import './column.scss';

const { Panel } = Collapse;

const Column = <T extends object>({
  title = '',
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
}: ColumnProps<T>) => {
  const isDisabled = !selectedItemId;
  const refs = useMemo(
    () =>
      items.reduce((acc: Record<string, RefObject<HTMLDivElement>>, item) => {
        acc[item.id] = createRef<HTMLDivElement>();
        return acc;
      }, {}),
    [items, selectedItemId],
  );
  const [currentColumnWidth, setCurrentColumnWidth] = useState<number>(300);
  const [activeGroupKeys, setActiveGroupKeys] = useState<string[]>([]);
  const [isCollapse, setIsCollapse] = useState<boolean>(false);

  const sortOptions = useMemo(() => {
    const defaultOption = { value: 'default', label: 'По умолчанию' };
    return sortableFields.length > 0 ? [defaultOption, ...sortableFields] : [];
  }, [sortableFields]);

  useEffect(() => {
    const initColumnWidth = () => {
      const segments = window.location.pathname.replace(/^\/+/, '').split('/');
      const path = segments[0];
      const storageKey = columnKey ? `${path}_${columnKey}` : path;
      const storedWidth = localStorage.getItem(storageKey);
      if (storedWidth) {
        setCurrentColumnWidth(Number(storedWidth));
      }
    };

    initColumnWidth();
  }, [columnKey]);

  const groupedItems = useMemo(() => {
    if (!groupBy) {
      return { grouped: {}, ungrouped: items };
    }

    const grouped: Record<string, ColumnItem<T>[]> = {};
    const ungrouped: ColumnItem<T>[] = [];

    items.forEach((item) => {
      const groupKey = item[groupBy];
      if (groupKey !== undefined && groupKey !== null && groupKey !== '') {
        const key = String(groupKey);
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(item);
      } else {
        ungrouped.push(item);
      }
    });

    return { grouped, ungrouped };
  }, [items, groupBy]);

  const shouldShowGroups = useMemo(() => {
    if (!groupBy) return false;

    return Object.keys(groupedItems.grouped).length > 0;
  }, [groupBy, groupedItems]);

  const findSelectedItemGroup = useMemo(() => {
    if (!selectedItemId || !groupBy) return null;

    const activeItem = items.find(
      (item) => item.id.toString() === selectedItemId,
    );
    if (!activeItem) return null;

    const groupKey = activeItem[groupBy];
    if (groupKey === undefined || groupKey === null || groupKey === '') {
      return 'noGroup';
    }
    return String(groupKey);
  }, [selectedItemId, items, groupBy]);

  const groupsWithSearchResults = useMemo(() => {
    if (!searchValue || !groupBy) return new Set<string>();

    const result = new Set<string>();

    Object.entries(groupedItems.grouped).forEach(([groupKey, groupItems]) => {
      const hasMatch = groupItems.some((item) =>
        item.name.toString().toLowerCase().includes(searchValue.toLowerCase()),
      );
      if (hasMatch) {
        result.add(groupKey);
      }
    });

    if (groupedItems.ungrouped.length > 0) {
      const hasMatchInUngrouped = groupedItems.ungrouped.some((item) =>
        item.name.toString().toLowerCase().includes(searchValue.toLowerCase()),
      );
      if (hasMatchInUngrouped) {
        result.add('noGroup');
      }
    }

    return result;
  }, [searchValue, groupBy, groupedItems]);

  useEffect(() => {
    if (!shouldShowGroups) return;

    const getAllGroupKeys = (): string[] => {
      const allGroupKeys = Object.keys(groupedItems.grouped);
      const hasUngrouped = groupedItems.ungrouped.length > 0;

      if (hasUngrouped) {
        return [...allGroupKeys, 'noGroup'];
      }

      return allGroupKeys;
    };

    const shouldUpdateGroupKeys = (newKeys: string[]): boolean => {
      const currentKeysSorted = [...activeGroupKeys].sort();
      const newKeysSorted = [...newKeys].sort();
      return (
        JSON.stringify(currentKeysSorted) !== JSON.stringify(newKeysSorted)
      );
    };

    if (
      activeGroupKeys.length === 0 &&
      !isCollapse &&
      (!searchValue || searchValue.trim() === '')
    ) {
      const groupsToOpen = getAllGroupKeys();
      if (groupsToOpen.length > 0) {
        setActiveGroupKeys(groupsToOpen);
      }
      return;
    }

    if (groupBy) {
      if (searchValue && searchValue.trim() !== '') {
        const groupsToOpen = Array.from(groupsWithSearchResults);

        if (shouldUpdateGroupKeys(groupsToOpen)) {
          if (groupsToOpen.length > 0) {
            setActiveGroupKeys(groupsToOpen);
            setIsCollapse(true);
          }
        }
        return;
      }

      if ((!searchValue || searchValue === '') && !isCollapse) {
        const groupsToOpen = getAllGroupKeys();

        if (shouldUpdateGroupKeys(groupsToOpen)) {
          setActiveGroupKeys(groupsToOpen);
        }
        return;
      }
    }

    if (
      findSelectedItemGroup &&
      !isCollapse &&
      !activeGroupKeys.includes(findSelectedItemGroup)
    ) {
      setActiveGroupKeys((prev) => [...prev, findSelectedItemGroup]);
    }
  }, [
    shouldShowGroups,
    activeGroupKeys,
    isCollapse,
    groupedItems,
    searchValue,
    groupBy,
    groupsWithSearchResults,
    findSelectedItemGroup,
    setActiveGroupKeys,
    setIsCollapse,
  ]);

  useEffect(() => {
    if (!selectedItemId || isLoading) {
      return;
    }

    const scrollToElement = () => {
      const currentRef = refs[selectedItemId];
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
  }, [selectedItemId, refs, activeGroupKeys]);

  const handleSortChange = (value: string) => {
    if (value === 'default') {
      onChangeSortValue?.(undefined);
      onChangeDirectionValue?.(undefined);
    } else {
      onChangeSortValue?.(value as keyof T);
      onChangeDirectionValue?.(directionValue || 'asc');
    }
  };

  const sortItems = (arr: ColumnItem<T>[]) => {
    if (!sortValue || !directionValue) {
      return arr;
    }

    return arr.slice().sort((a, b) => {
      const valueA = a[sortValue];
      const valueB = b[sortValue];
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return directionValue === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return directionValue === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return directionValue === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  };

  const checkIsActive = (id: string | number): boolean =>
    id.toString() === selectedItemId;

  const sortedGroupedItems = useMemo(() => {
    const { grouped, ungrouped } = groupedItems;

    const sortedGroupKeys = Object.keys(grouped).sort(
      sortGroups || ((a, b) => a.localeCompare(b)),
    );
    const sortedGroups: Record<string, ColumnItem<T>[]> = {};

    sortedGroupKeys.forEach((key) => {
      sortedGroups[key] = sortItems(grouped[key]);
    });

    return {
      grouped: sortedGroups,
      ungrouped: sortItems(ungrouped),
    };
  }, [groupedItems, sortValue, directionValue]);

  const handleCollapseChange = (keys: string | string[]) => {
    const newKeys = Array.isArray(keys) ? keys : [keys];
    setActiveGroupKeys(newKeys);

    const allPossibleGroups = [
      ...Object.keys(groupedItems.grouped),
      ...(groupedItems.ungrouped.length > 0 ? ['noGroup'] : []),
    ];

    switch (true) {
      case newKeys.length === 0 && allPossibleGroups.length > 0:
        setIsCollapse(true);
        break;

      case newKeys.length > 0 && newKeys.length < allPossibleGroups.length:
        setIsCollapse(true);
        break;

      case newKeys.length === allPossibleGroups.length:
        setIsCollapse(false);
        break;

      default:
        break;
    }
  };

  const renderItem = (item: ColumnItem<T>) => (
    <div
      aria-hidden="true"
      tabIndex={0}
      role="button"
      data-cy="firstColumnItem"
      ref={refs[item.id]}
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

  const renderContent = useMemo(() => {
    if (!shouldShowGroups) {
      const allItems = [...sortedGroupedItems.ungrouped];
      return <List dataSource={allItems} renderItem={renderItem} />;
    }

    const panels = [];

    if (Object.keys(sortedGroupedItems.grouped).length > 0) {
      Object.entries(sortedGroupedItems.grouped).forEach(
        ([groupKey, groupItems]) => {
          panels.push(
            <Panel
              key={groupKey}
              header={
                renderHeaderGroup
                  ? renderHeaderGroup(groupKey, groupItems)
                  : `${groupKey} (${groupItems.length})`
              }
            >
              <List dataSource={groupItems} renderItem={renderItem} />
            </Panel>,
          );
        },
      );
    }

    if (sortedGroupedItems.ungrouped.length > 0) {
      panels.push(
        <Panel
          key="noGroup"
          header={`Без группы (${sortedGroupedItems.ungrouped.length})`}
        >
          <List
            dataSource={sortedGroupedItems.ungrouped}
            renderItem={renderItem}
          />
        </Panel>,
      );
    }

    return (
      <Collapse
        activeKey={activeGroupKeys}
        onChange={handleCollapseChange}
        className="column__groups"
      >
        {panels}
      </Collapse>
    );
  }, [
    shouldShowGroups,
    sortedGroupedItems,
    groupBy,
    renderHeaderGroup,
    renderItem,
    activeGroupKeys,
  ]);

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
        const segments = window.location.pathname
          .replace(/^\/+/, '')
          .split('/');
        const path = segments[0];
        const storageKey = columnKey ? `${path}_${columnKey}` : path;
        localStorage.setItem(storageKey, size.width.toString());
      }}
    >
      <div className="column__header">
        {title && (
          <div className="column__header__wrap">
            <Tooltip placement="topLeft" title={title} mouseEnterDelay={1}>
              <h3 className="column__header__wrap__title">{title}</h3>
            </Tooltip>
            {items.length > 0 && (
              <span className="column__header__wrap__count">
                {items.length +
                  ' ' +
                  pluralize(items.length, ['элемент', 'элемента', 'элементов'])}
              </span>
            )}
          </div>
        )}
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
            {showRemoveBtn && (
              <Popconfirm
                disabled={isDisabled}
                onConfirm={() => onRemoveItem(selectedItemId)}
                title="Вы действительно хотите удалить этот элемент?"
              >
                <Button
                  loading={loadingRemove}
                  data-cy="removeItem"
                  disabled={isDisabled}
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            )}
          </Space.Compact>
        </div>
        {sortableFields.length > 0 && (
          <div className="column__header__sort-controls">
            <div className="column__header__sort-controls__sort-select">
              <span className="column__header__sort-controls__sort-select__label">
                Сортировка
              </span>
              <Select
                placeholder="Выберите поле"
                variant="borderless"
                size="small"
                value={sortValue ? String(sortValue) : 'default'}
                onChange={handleSortChange}
                options={sortOptions}
              />
            </div>
            <Button
              className="column__header__sort-controls__button"
              size="small"
              icon={
                directionValue === 'asc' ? (
                  <SortDescendingOutlined />
                ) : (
                  <SortAscendingOutlined />
                )
              }
              disabled={!sortValue}
              onClick={() =>
                onChangeDirectionValue
                  ? onChangeDirectionValue(
                      directionValue === 'asc' ? 'desc' : 'asc',
                    )
                  : null
              }
            />
          </div>
        )}
      </div>
      <SimpleBar className="column__items">
        {isLoading && items.length === 0 ? (
          <Skeleton active />
        ) : (
          items.length > 0 && renderContent
        )}
      </SimpleBar>
    </ResizableBox>
  );
};

export default Column;
