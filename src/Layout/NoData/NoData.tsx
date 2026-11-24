import { InboxOutlined } from '@ant-design/icons';
import { NoDataPropsType } from './no-data.type';
import './noData.scss';
import '../column-state.scss';

const NoData = ({ content, appearance = 'modern' }: NoDataPropsType) => {
  if (appearance === 'classic')
    return <div className="noData">{content ?? <h2>Нет данных</h2>}</div>;
  return (
    <div className="column-state noData--modern">
      <div className="column-state__body">
        {content ?? (
          <>
            <div className="column-state__icon" aria-hidden="true">
              <InboxOutlined />
            </div>
            <h2>Нет данных</h2>
            <p>Когда данные появятся, они будут отображаться здесь.</p>
          </>
        )}
      </div>
    </div>
  );
};
export default NoData;
