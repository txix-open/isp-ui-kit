import { ColumnProps } from './column.type';
import './column.scss';
declare const Column: <T extends {}>({
  items,
  onAddItem,
  onRemoveItem,
  showRemoveBtn,
  showAddBtn,
  selectedItemId,
  setSelectedItemId,
  searchValue,
  onChangeSearchValue,
  renderItems,
}: ColumnProps<T>) => import('react/jsx-runtime').JSX.Element;
export default Column;
