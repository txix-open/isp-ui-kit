import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import SearchInputProps from './search-input.type';

const SearchInput = ({ ...rest }: SearchInputProps) => (
  <Input autoComplete="off" {...rest} prefix={<SearchOutlined />} allowClear />
);

export default SearchInput;
