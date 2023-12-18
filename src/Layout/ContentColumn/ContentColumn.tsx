import SimpleBar from 'simplebar-react';

import './content-column.scss';
import { FC } from 'react';
import { ContentColumnProps } from './content-column';

const ContentColumn: FC<ContentColumnProps> = ({ children = null }) => (
  <SimpleBar className="column-content">{children}</SimpleBar>
);

export default ContentColumn;
