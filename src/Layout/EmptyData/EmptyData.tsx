import { SelectOutlined } from '@ant-design/icons';
import { EmptyDataPropsType } from './empty-data.type';
import './empty-data.scss';
import '../column-state.scss';

const EmptyData = ({ content, appearance = 'modern' }: EmptyDataPropsType) => {
  if (appearance === 'classic')
    return (
      <div className="empty-data">{content ?? <h1>Выберите элемент</h1>}</div>
    );
  return (
    <div className="column-state empty-data--modern">
      <div className="column-state__body">
        {content ?? (
          <>
            <div className="column-state__icon" aria-hidden="true">
              <SelectOutlined />
            </div>
            <h2>Выберите элемент</h2>
            <p>Выберите элемент в списке, чтобы посмотреть его данные.</p>
          </>
        )}
      </div>
    </div>
  );
};
export default EmptyData;
