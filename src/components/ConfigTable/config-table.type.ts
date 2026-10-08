import { TableProps } from 'antd';
import { ReactNode } from 'react';

export type ConfigTableProps = {
  appearance?: 'modern' | 'classic';
  /** Applied query, controlled by the application. */
  searchValue?: string;
  totalItemsCount?: number;
  /** Matching count for remote pagination; defaults to dataSource.length. */
  filteredItemsCount?: number;
  onResetSearch?: () => void;
  selectionActions?: ReactNode;
  onClearSelection?: () => void;
  onSearch?: (value: string) => void;
  onClickBtn?: () => void;
  textBtn?: string;
  placeholderSearch?: string;
  dataSource: any[];
  isAddBtn?: boolean;
  isSearch?: boolean;
} & TableProps;
