import { Pagination as AntPagination, Select, Table } from 'antd';
import type { TablePaginationConfig } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ColumnType, SorterResult } from 'antd/es/table/interface';
import type { Key, MouseEvent, PointerEvent, ReactNode } from 'react';
import {
  isValidElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { PcsSortIcon } from '../../assets/icons';

import './PcsTable.scss';

export type PcsTableSortOrder = 'ascend' | 'descend' | null;

export interface PcsTableSortInfo {
  field: string;
  order: PcsTableSortOrder;
}

export interface PcsTablePagination {
  current: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  showEndButton?: boolean;
  showSizeChanger?: boolean;
  onChange?: (page: number, pageSize: number) => void;
}

export interface PcsTableSelection<T extends object> {
  selectedRowKeys?: Key[];
  onChange?: (selectedRowKeys: Key[], selectedRows: T[]) => void;
}

export interface PcsTableSorting {
  field?: string;
  order?: PcsTableSortOrder;
  onChange?: (sortInfo: PcsTableSortInfo) => void;
}

export type PcsTableLayout = 'container' | 'page';

export interface PcsTableProps<T extends object> {
  data: T[];
  columns: ColumnsType<T>;
  loading?: boolean;
  layout?: PcsTableLayout;
  minWidth?: number;
  rowKey?: string | ((record: T) => Key);
  selection?: PcsTableSelection<T>;
  pagination?: PcsTablePagination;
  sorting?: PcsTableSorting;
  onRowClick?: (record: T) => void;
  className?: string;
}

const DEFAULT_TABLE_MIN_WIDTH = 1240;
const SELECTION_COLUMN_WIDTH = 56;
const MIN_COLUMN_WIDTH = 96;
const MAX_COLUMN_WIDTH = 360;
const BODY_CHARACTER_WIDTH = 7.8;
const HEADER_CHARACTER_WIDTH = 7.2;
const CELL_WIDTH_OFFSET = 42;
const SORT_WIDTH_OFFSET = 34;

type ColumnRenderOutput = ReactNode | { children?: ReactNode };

const clampColumnWidth = (width: number) =>
  Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, Math.ceil(width)));

const getVisibleText = (value: unknown): string => {
  if (value === null || value === undefined || typeof value === 'boolean') {
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(getVisibleText).filter(Boolean).join(' ');
  }

  if (isValidElement(value)) {
    const props = value.props as { children?: ReactNode };
    return getVisibleText(props.children);
  }

  if (typeof value === 'object' && 'children' in value) {
    return getVisibleText((value as { children?: ReactNode }).children);
  }

  return '';
};

const getDataIndexValue = <T extends object>(
  record: T,
  dataIndex: ColumnType<T>['dataIndex'],
) => {
  if (!dataIndex) {
    return undefined;
  }

  const path = Array.isArray(dataIndex) ? dataIndex : [dataIndex];

  return path.reduce<unknown>((value, key) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    return (value as Record<string, unknown>)[String(key)];
  }, record);
};

const getMaxTextLength = (texts: string[]) =>
  texts.reduce((maxLength, text) => {
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    return Math.max(maxLength, normalizedText.length);
  }, 0);

const estimateColumnWidth = <T extends object>(
  column: ColumnType<T>,
  data: T[],
) => {
  const titleText = getVisibleText(column.title);
  const valueTexts = data.map((record, index) => {
    const value = getDataIndexValue(record, column.dataIndex);

    if (!column.render) {
      return getVisibleText(value);
    }

    return getVisibleText(
      column.render(value, record, index) as ColumnRenderOutput,
    );
  });

  const titleWidth = getMaxTextLength([titleText]) * HEADER_CHARACTER_WIDTH;
  const bodyWidth = getMaxTextLength(valueTexts) * BODY_CHARACTER_WIDTH;
  const sortOffset = column.sorter ? SORT_WIDTH_OFFSET : 0;

  return clampColumnWidth(
    Math.max(titleWidth + sortOffset, bodyWidth) + CELL_WIDTH_OFFSET,
  );
};

const applyAdaptiveColumnWidths = <T extends object>(
  columns: ColumnsType<T>,
  data: T[],
): ColumnsType<T> =>
  columns.map((column) => {
    if ('children' in column && column.children?.length) {
      return {
        ...column,
        children: applyAdaptiveColumnWidths(column.children, data),
      };
    }

    const columnWidth = estimateColumnWidth(column, data);

    if (typeof column.width === 'number') {
      return {
        ...column,
        width: Math.max(column.width, columnWidth),
      };
    }

    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: columnWidth,
    };
  });

const getColumnsWidth = <T extends object>(columns: ColumnsType<T>): number =>
  columns.reduce((totalWidth, column) => {
    if ('children' in column && column.children?.length) {
      return totalWidth + getColumnsWidth(column.children);
    }

    return totalWidth + (typeof column.width === 'number' ? column.width : 0);
  }, 0);

const getNumericLeafColumnCount = <T extends object>(
  columns: ColumnsType<T>,
): number =>
  columns.reduce((totalCount, column) => {
    if ('children' in column && column.children?.length) {
      return totalCount + getNumericLeafColumnCount(column.children);
    }

    return totalCount + (typeof column.width === 'number' ? 1 : 0);
  }, 0);

const distributeExtraColumnWidth = <T extends object>(
  columns: ColumnsType<T>,
  extraWidth: number,
): ColumnsType<T> => {
  const leafColumnCount = getNumericLeafColumnCount(columns);

  if (extraWidth <= 0 || leafColumnCount === 0) {
    return columns;
  }

  const normalizedExtraWidth = Math.ceil(extraWidth);
  const baseExtraWidth = Math.floor(normalizedExtraWidth / leafColumnCount);
  const extraWidthRemainder = normalizedExtraWidth % leafColumnCount;
  let leafColumnIndex = 0;

  const applyExtraWidth = (items: ColumnsType<T>): ColumnsType<T> =>
    items.map((column) => {
      if ('children' in column && column.children?.length) {
        return {
          ...column,
          children: applyExtraWidth(column.children),
        };
      }

      if (typeof column.width !== 'number') {
        return column;
      }

      const columnExtraWidth =
        baseExtraWidth + (leafColumnIndex < extraWidthRemainder ? 1 : 0);

      leafColumnIndex += 1;

      return {
        ...column,
        width: column.width + columnExtraWidth,
      };
    });

  return applyExtraWidth(columns);
};

const getSorterField = <T extends object>(
  sorter: SorterResult<T> | SorterResult<T>[],
) => {
  if (Array.isArray(sorter)) {
    return '';
  }

  const columnKey = (sorter as { columnKey?: Key }).columnKey;

  if (columnKey !== undefined) {
    return String(columnKey);
  }

  if (Array.isArray(sorter.field)) {
    return sorter.field.join('.');
  }

  return (sorter.field as string) || '';
};

const getColumnSortField = <T extends object>(column: ColumnType<T>) => {
  const columnKey = (column as { key?: Key }).key;

  if (columnKey !== undefined) {
    return String(columnKey);
  }

  if (Array.isArray(column.dataIndex)) {
    return column.dataIndex.join('.');
  }

  return column.dataIndex ? String(column.dataIndex) : '';
};

const getRecordKey = <T extends object>(
  record: T,
  rowKey: string | ((record: T) => Key),
) => {
  if (typeof rowKey === 'function') {
    return rowKey(record);
  }

  return (record as Record<string, Key>)[rowKey];
};

const DataTablePcsSortIcon = ({ sortOrder }: { sortOrder?: string | null }) => {
  const showAsc = !sortOrder || sortOrder === 'ascend';
  const showDesc = !sortOrder || sortOrder === 'descend';

  return (
    <span className="pcs-table__sort-icons">
      {showDesc && (
        <PcsSortIcon
          className="pcs-table__sort-icon pcs-table__sort-icon--desc"
          aria-hidden="true"
        />
      )}
      {showAsc && (
        <PcsSortIcon
          className="pcs-table__sort-icon pcs-table__sort-icon--asc"
          aria-hidden="true"
        />
      )}
    </span>
  );
};

const PcsTable = <T extends object>({
  data,
  columns,
  loading,
  layout = 'container',
  minWidth = DEFAULT_TABLE_MIN_WIDTH,
  rowKey = 'id',
  selection,
  pagination,
  sorting,
  onRowClick,
  className,
}: PcsTableProps<T>) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const syncSourceRef = useRef<'table' | 'top' | null>(null);
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const [topScrollWidth, setTopScrollWidth] = useState(minWidth);
  const [topScrollViewportWidth, setTopScrollViewportWidth] = useState(0);
  const [topScrollLeft, setTopScrollLeft] = useState(0);
  const selectedRowKeys = selection?.selectedRowKeys || [];
  const lastPage = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
    : 1;
  const isFirstPage = pagination ? pagination.current <= 1 : true;
  const isLastPage = pagination ? pagination.current >= lastPage : true;

  const pageSizeOptions = pagination?.pageSizeOptions || [10, 20, 25, 50, 100];
  const currentPageKeys = data.map((item) => getRecordKey(item, rowKey));
  const currentPageSelectedKeys = currentPageKeys.filter((key) =>
    selectedRowKeys.includes(key),
  );
  const isCurrentPageSelected =
    currentPageKeys.length > 0 &&
    currentPageSelectedKeys.length === currentPageKeys.length;
  const isCurrentPageIndeterminate =
    currentPageSelectedKeys.length > 0 &&
    currentPageSelectedKeys.length < currentPageKeys.length;
  const sortingField = sorting?.field;
  const sortingOrder = sorting?.order;

  const columnsWithSort = useMemo(() => {
    const adaptiveColumns = applyAdaptiveColumnWidths(columns, data);

    const sortableColumns = adaptiveColumns.map((column) => {
      const isSortable = Boolean((column as { sorter?: unknown }).sorter);

      if (!isSortable) {
        return column;
      }

      const columnSortField = getColumnSortField(column as ColumnType<T>);

      return {
        ...column,
        showSorterTooltip: false,
        sortIcon: (props: { sortOrder?: string | null }) => (
          <DataTablePcsSortIcon sortOrder={props.sortOrder} />
        ),
        sortOrder:
          sortingField && columnSortField === sortingField
            ? sortingOrder || undefined
            : null,
      };
    });
    const selectionWidth = selection ? SELECTION_COLUMN_WIDTH : 0;
    const columnsWidth = getColumnsWidth(sortableColumns);
    const targetColumnsWidth = Math.max(
      minWidth - selectionWidth,
      columnsWidth,
    );

    return distributeExtraColumnWidth(
      sortableColumns,
      targetColumnsWidth - columnsWidth,
    );
  }, [columns, data, minWidth, selection, sortingField, sortingOrder]);

  const tableScrollWidth = Math.max(
    minWidth,
    getColumnsWidth(columnsWithSort) + (selection ? SELECTION_COLUMN_WIDTH : 0),
  );

  useLayoutEffect(() => {
    const rootElement = rootRef.current;
    const topScrollElement = topScrollRef.current;

    if (!rootElement || !topScrollElement) return undefined;

    const getTableContentElement = () =>
      rootElement.querySelector<HTMLElement>('.ant-table-content');

    const updateScrollState = () => {
      const tableContentElement = getTableContentElement();

      if (!tableContentElement) {
        setHasHorizontalScroll(false);
        setTopScrollViewportWidth(0);
        setTopScrollLeft(0);
        return;
      }

      const nextScrollWidth = tableContentElement.scrollWidth;
      const nextClientWidth = tableContentElement.clientWidth;
      const nextHasHorizontalScroll = nextScrollWidth > nextClientWidth + 1;

      setTopScrollWidth(nextScrollWidth);
      setTopScrollViewportWidth(nextClientWidth);
      setHasHorizontalScroll(nextHasHorizontalScroll);
      topScrollElement.scrollLeft = tableContentElement.scrollLeft;
      setTopScrollLeft(tableContentElement.scrollLeft);
    };

    updateScrollState();

    const tableContentElement = getTableContentElement();

    if (!tableContentElement) return undefined;

    const resetSyncSource = () => {
      syncSourceRef.current = null;
    };

    const handleTopScroll = () => {
      if (syncSourceRef.current === 'table') return;

      syncSourceRef.current = 'top';
      tableContentElement.scrollLeft = topScrollElement.scrollLeft;
      setTopScrollLeft(topScrollElement.scrollLeft);
      window.requestAnimationFrame(resetSyncSource);
    };

    const handleTableScroll = () => {
      if (syncSourceRef.current === 'top') return;

      syncSourceRef.current = 'table';
      topScrollElement.scrollLeft = tableContentElement.scrollLeft;
      setTopScrollLeft(tableContentElement.scrollLeft);
      window.requestAnimationFrame(resetSyncSource);
    };

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(rootElement);
    resizeObserver.observe(tableContentElement);

    topScrollElement.addEventListener('scroll', handleTopScroll, {
      passive: true,
    });
    tableContentElement.addEventListener('scroll', handleTableScroll, {
      passive: true,
    });
    window.addEventListener('resize', updateScrollState);

    return () => {
      resizeObserver.disconnect();
      topScrollElement.removeEventListener('scroll', handleTopScroll);
      tableContentElement.removeEventListener('scroll', handleTableScroll);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [columnsWithSort, data, loading, tableScrollWidth]);

  const topScrollThumbWidth =
    hasHorizontalScroll && topScrollWidth > 0 && topScrollViewportWidth > 0
      ? Math.max(
          32,
          (topScrollViewportWidth / topScrollWidth) * topScrollViewportWidth,
        )
      : 0;
  const topScrollMaxLeft = Math.max(0, topScrollWidth - topScrollViewportWidth);
  const topScrollThumbMaxLeft = Math.max(
    0,
    topScrollViewportWidth - topScrollThumbWidth,
  );
  const topScrollThumbLeft =
    topScrollMaxLeft > 0
      ? (topScrollLeft / topScrollMaxLeft) * topScrollThumbMaxLeft
      : 0;

  const setTopScrollPosition = (nextScrollLeft: number) => {
    if (!topScrollRef.current) return;

    const normalizedScrollLeft = Math.max(
      0,
      Math.min(topScrollMaxLeft, nextScrollLeft),
    );

    topScrollRef.current.scrollLeft = normalizedScrollLeft;
    setTopScrollLeft(normalizedScrollLeft);
  };

  const handleTopScrollTrackPointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (!topScrollThumbWidth || !topScrollThumbMaxLeft) return;

    const trackRect = event.currentTarget.getBoundingClientRect();
    const nextThumbLeft = Math.max(
      0,
      Math.min(
        topScrollThumbMaxLeft,
        event.clientX - trackRect.left - topScrollThumbWidth / 2,
      ),
    );

    setTopScrollPosition(
      (nextThumbLeft / topScrollThumbMaxLeft) * topScrollMaxLeft,
    );
  };

  const handleTopScrollThumbPointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (!topScrollThumbMaxLeft) return;

    event.preventDefault();
    event.stopPropagation();

    const startClientX = event.clientX;
    const startScrollLeft = topScrollLeft;

    const handlePointerMove = (pointerEvent: globalThis.PointerEvent) => {
      const nextScrollLeft =
        startScrollLeft +
        ((pointerEvent.clientX - startClientX) / topScrollThumbMaxLeft) *
          topScrollMaxLeft;

      setTopScrollPosition(nextScrollLeft);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleTableChange = (
    paginationConfig: TablePaginationConfig,
    _filters: Record<string, unknown>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => {
    if (
      pagination?.onChange &&
      paginationConfig.current &&
      paginationConfig.pageSize
    ) {
      pagination.onChange(paginationConfig.current, paginationConfig.pageSize);
    }

    if (sorting?.onChange && !Array.isArray(sorter)) {
      sorting.onChange({
        field: getSorterField(sorter),
        order: sorter.order || null,
      });
    }
  };

  const rowSelection = selection
    ? {
        columnWidth: SELECTION_COLUMN_WIDTH,
        columnTitle: (
          <label
            className={`pcs-table__checkbox${
              isCurrentPageIndeterminate
                ? ' pcs-table__checkbox--indeterminate'
                : ''
            }`}
          >
            <input
              checked={isCurrentPageSelected}
              className="pcs-table__checkbox-native"
              type="checkbox"
              onChange={() => {
                const selectedKeySet = new Set(selectedRowKeys);
                const nextSelectedKeys = isCurrentPageSelected
                  ? selectedRowKeys.filter(
                      (key) => !currentPageKeys.includes(key),
                    )
                  : [
                      ...selectedRowKeys,
                      ...currentPageKeys.filter(
                        (key) => !selectedKeySet.has(key),
                      ),
                    ];
                const nextSelectedRows = data.filter((item) =>
                  nextSelectedKeys.includes(getRecordKey(item, rowKey)),
                );

                selection.onChange?.(nextSelectedKeys, nextSelectedRows);
              }}
            />
            <span className="pcs-table__checkbox-square">
              <svg
                fill="none"
                height="16"
                stroke="#ff596d"
                strokeWidth="2px"
                viewBox="0 0 16 16"
                width="16"
              >
                <polyline points="13 5 6 12 2 8" />
              </svg>
            </span>
          </label>
        ),
        selectedRowKeys,
        renderCell: (checked: boolean, record: T) => (
          <label className="pcs-table__checkbox">
            <input
              checked={checked}
              className="pcs-table__checkbox-native"
              type="checkbox"
              onChange={() => {
                const key = getRecordKey(record, rowKey);
                const nextSelectedKeys = checked
                  ? selectedRowKeys.filter((selectedKey) => selectedKey !== key)
                  : [...selectedRowKeys, key];
                const nextSelectedRows = data.filter((item) =>
                  nextSelectedKeys.includes(getRecordKey(item, rowKey)),
                );

                selection.onChange?.(nextSelectedKeys, nextSelectedRows);
              }}
            />
            <span className="pcs-table__checkbox-square">
              <svg
                fill="none"
                height="16"
                stroke="#ff596d"
                strokeWidth="2px"
                viewBox="0 0 16 16"
                width="16"
              >
                <polyline points="13 5 6 12 2 8" />
              </svg>
            </span>
          </label>
        ),
        onChange: selection.onChange,
      }
    : undefined;

  const rowClickConfig = onRowClick
    ? (record: T) => ({
        onClick: (event: MouseEvent<HTMLElement>) => {
          const target = event.target as HTMLElement;
          const interactiveElement = target.closest(
            [
              'a',
              'button',
              'input',
              'textarea',
              'select',
              '.ant-checkbox',
              '.ant-checkbox-wrapper',
              '.pcs-table__checkbox',
              '.ant-dropdown-trigger',
              '[role="button"]',
            ].join(','),
          );

          if (!interactiveElement) {
            onRowClick(record);
          }
        },
      })
    : undefined;

  return (
    <div
      ref={rootRef}
      className={[
        'pcs-table',
        layout === 'page' && 'pcs-table--page',
        onRowClick && 'pcs-table--clickable',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        ref={topScrollRef}
        aria-hidden="true"
        className={`pcs-table__top-scroll${
          hasHorizontalScroll ? ' pcs-table__top-scroll--visible' : ''
        }`}
      >
        <div
          className="pcs-table__top-scroll-content"
          style={{ width: topScrollWidth }}
        />
        <div
          className="pcs-table__top-scroll-track"
          onPointerDown={handleTopScrollTrackPointerDown}
        >
          <div
            className="pcs-table__top-scroll-thumb"
            style={{
              transform: `translateX(${topScrollThumbLeft}px)`,
              width: topScrollThumbWidth,
            }}
            onPointerDown={handleTopScrollThumbPointerDown}
          />
        </div>
      </div>
      <Table
        columns={columnsWithSort}
        dataSource={data}
        loading={loading}
        pagination={false}
        rowHoverable={false}
        rowKey={rowKey}
        rowSelection={rowSelection}
        scroll={{ x: tableScrollWidth }}
        tableLayout="fixed"
        onChange={handleTableChange}
        onRow={rowClickConfig}
      />

      {pagination && (
        <div className="pcs-table__pagination">
          {pagination.showEndButton !== false && (
            <button
              className="pcs-table__pagination-boundary"
              disabled={isFirstPage}
              type="button"
              onClick={() => pagination.onChange?.(1, pagination.pageSize)}
            >
              В начало
            </button>
          )}
          <AntPagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            showLessItems={false}
            showSizeChanger={false}
            total={pagination.total}
            onChange={(page, pageSize) => pagination.onChange?.(page, pageSize)}
          />
          {pagination.showEndButton !== false && (
            <button
              className="pcs-table__pagination-boundary"
              disabled={isLastPage}
              type="button"
              onClick={() =>
                pagination.onChange?.(lastPage, pagination.pageSize)
              }
            >
              В конец
            </button>
          )}
          {pagination.showSizeChanger !== false && (
            <Select
              className="pcs-table__pagination-size"
              classNames={{
                popup: {
                  root: 'pcs-table__pagination-size-popup',
                },
              }}
              options={pageSizeOptions.map((option) => ({
                label: String(option),
                value: option,
              }))}
              popupMatchSelectWidth={false}
              suffixIcon={
                <span
                  className="pcs-table__pagination-size-caret"
                  aria-hidden="true"
                />
              }
              value={pagination.pageSize}
              onChange={(nextPageSize) =>
                pagination.onChange?.(1, nextPageSize)
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PcsTable;
