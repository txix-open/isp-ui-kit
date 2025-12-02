import { NoDataPropsType } from './no-data.type';

import './noData.scss';

const NoData = ({ content }: NoDataPropsType) => (
  <div className="noData">{content ? content : <h2>Нет данных</h2>}</div>
);

export default NoData;
