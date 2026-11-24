import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import SearchInputProps from './search-input.type';
import './search-input.scss';

const SearchInput = ({ className, ...rest }: SearchInputProps) => (
  <Input
    autoComplete="off"
    prefix={<SearchOutlined aria-hidden="true" />}
    allowClear
    aria-label={rest['aria-label'] ?? rest.placeholder ?? 'Поиск'}
    {...rest}
    className={['kit-search', className].filter(Boolean).join(' ')}
  />
);

export default SearchInput;
