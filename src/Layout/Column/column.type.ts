import { ChangeEvent, ReactElement, ReactNode } from 'react';

export interface ColumnProps<T extends object> {
  title?: ReactNode;
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
}

export type ColumnItem<T extends {}> = T & {
  name: string;
  id: string | number;
  icon?: ReactNode;
};

export type SortItemType<T> = { value: keyof T; label: string };
