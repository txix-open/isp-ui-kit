import { TableProps } from 'antd';

export type ConfigTableProps = {
  onSearch?: (value: string) => void;
  onClickBtn?: () => void;
  textBtn?: string;
  placeholderSearch?: string;
  dataSource: any[];
  isAddBtn?: boolean;
  isSearch?: boolean;
} & TableProps;
