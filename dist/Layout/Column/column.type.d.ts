import { ChangeEvent, ReactElement, ReactNode } from 'react';
export interface ColumnProps<T extends {}> {
  items: ColumnItem<T>[];
  renderItems: (item: T) => ReactElement;
  searchValue: string;
  selectedItemId: string;
  showAddBtn?: boolean;
  showUpdateBtn?: boolean;
  showRemoveBtn?: boolean;
  setSelectedItemId: (itemId: string) => void;
  onChangeSearchValue: (
    value: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onAddItem?: () => void;
  onUpdateItem?: (id: string) => void;
  onRemoveItem?: (id: string) => void;
}
export type ColumnItem<T extends {}> = T & {
  name: string;
  id: string | number;
  icon?: ReactNode;
};
