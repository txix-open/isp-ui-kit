import { ChangeEvent, ReactElement, ReactNode } from 'react';

export interface ColumnProps<T extends object> {
  /** Modern is the default; classic provides the previous design. */
  appearance?: 'classic' | 'modern';
  /** Total before filtering; used to show the search result count. */
  totalItemsCount?: number;
  title?: ReactNode;
  extraTitle?: ReactNode;
  tooltipTitle?: ReactNode;
  items: ColumnItem<T>[];
  renderItems: (item: T) => ReactElement;
  searchPlaceholder?: string;
  searchValue: string;
  selectedItemId: string;
  showAddBtn?: boolean;
  showUpdateBtn?: boolean;
  showRemoveBtn?: boolean;
  columnKey?: string;
  setSelectedItemId: (itemId: string) => void;
  onChangeSearchValue: (
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onAddItem?: () => void;
  onUpdateItem?: (id: string) => void;
  onRemoveItem?: (id: string) => void;
  sortableFields?: SortItemType<T>[];
  sortValue?: keyof T;
  onChangeSortValue?: (value: keyof T | undefined) => void;
  directionValue?: string;
  onChangeDirectionValue?: (value: string | undefined) => void;
  loadingRemove?: boolean;
  groupBy?: keyof T;
  renderHeaderGroup?: (groupKey: string, items: ColumnItem<T>[]) => ReactNode;
  sortGroups?: (a: string, b: string) => number;
  isLoading?: boolean;
  removeConfirmDescription?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  disableRemovePopconfirm?: boolean;
  isCollapsible?: boolean;
  searchFields?: SortItemType<T>[];
  searchFieldValue?: string;
  onChangeSearchField?: (value: string) => void;
}

export type ColumnItem<T extends {}> = T & {
  name: string;
  id: string | number;
  icon?: ReactNode;
};

export type SortItemType<T> = { value: keyof T; label: string };

export type ColumnHeaderTitleProps = {
  selectionActions?: ReactNode;
  showAddBtn?: boolean;
  onAddItem?: () => void;
  appearance?: 'classic' | 'modern';
  totalItemsCount?: number;
  isSearching?: boolean;
  title?: ReactNode;
  extraTitle?: ReactNode;
  tooltipTitle?: ReactNode;
  itemsCount: number;
};

export type ColumnActionsProps = {
  appearance?: 'classic' | 'modern';
  searchPlaceholder: string;
  searchValue: string;
  onChangeSearchValue: (
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  showAddBtn: boolean;
  showUpdateBtn: boolean;
  showRemoveBtn: boolean;
  isDisabled: boolean;
  selectedItemId: string;
  onAddItem: () => void;
  onUpdateItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  loadingRemove: boolean;
  disableRemovePopconfirm: boolean;
  removeConfirmDescription?: ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export type ColumnSortControlsProps<T extends object> = {
  sortableFields?: SortItemType<T>[];
  sortValue?: keyof T;
  directionValue?: string;
  sortOptions: { value: string | keyof T; label: string }[];
  onChangeDirectionValue?: (value: string | undefined) => void;
  onSortChange: (value: string) => void;
};

export type ColumnSearchControlsProps<T extends object> = {
  searchFields?: SortItemType<T>[];
  searchFieldValue?: string;
  searchOptions: { value: string | keyof T; label: string }[];
  onSearchChange: (value: string) => void;
};

export type GroupedItems<T extends object> = {
  grouped: Record<string, ColumnItem<T>[]>;
  ungrouped: ColumnItem<T>[];
};
