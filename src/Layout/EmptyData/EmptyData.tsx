import { EmptyDataPropsType } from './empty-data.type';

import './empty-data.scss';

const EmptyData = ({ content }: EmptyDataPropsType) => (
  <div className="empty-data">
    {content ? content : <h1>Выберите элемент</h1>}
  </div>
);

export default EmptyData;
