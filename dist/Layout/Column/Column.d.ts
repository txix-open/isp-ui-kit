import { ColumnProps } from './column.type';
import './column.scss';
declare const Column: <T extends {}>({
  title,
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  showRemoveBtn,
  showUpdateBtn,
  showAddBtn,
  selectedItemId,
  setSelectedItemId,
  searchValue,
  onChangeSearchValue,
  renderItems,
}: ColumnProps<T>) => import('react/jsx-runtime').JSX.Element;
export default Column;
