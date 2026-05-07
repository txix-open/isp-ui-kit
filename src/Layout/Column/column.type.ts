import { ChangeEvent, ReactElement, ReactNode } from 'react';

export interface ColumnProps<T extends object> {
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
}

export type ColumnItem<T extends {}> = T & {
  name: string;
  id: string | number;
  icon?: ReactNode;
};

export type SortItemType<T> = { value: keyof T; label: string };

export type ColumnHeaderTitleProps = {
  title?: ReactNode;
  extraTitle?: ReactNode;
  tooltipTitle?: ReactNode;
  itemsCount: number;
};

export type ColumnActionsProps = {
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

export type GroupedItems<T extends object> = {
  grouped: Record<string, ColumnItem<T>[]>;
  ungrouped: ColumnItem<T>[];
};
