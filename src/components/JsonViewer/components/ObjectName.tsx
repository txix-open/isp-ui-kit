import { memo } from 'react';
import { useViewer } from '../context';
import { Highlight } from './Highlight';

interface ObjectNameProps {
  name: string | number | false | null;
  parentType?: 'object' | 'array' | 'array_group';
  jsvRoot?: boolean;
  /** Суффикс React key (legacy передавал namespace). */
  keySuffix: string;
}

/**
 * Имя узла со скобкой-задачкой (1:1 порт legacy ObjectName.jsx):
 * для массивов — индекс, для объектов — кавычки.
 */
const ObjectNameBase = ({
  name,
  parentType,
  jsvRoot,
  keySuffix,
}: ObjectNameProps) => {
  const { style, search } = useViewer();

  const display_name = name ? name : '';

  if (jsvRoot && (name === false || name === null)) {
    return <span />;
  }

  // подсветка вхождений запроса поиска (prop search)
  const nameText = String(display_name);
  const nameNode = <Highlight text={nameText} search={search} />;

  if (parentType === 'array') {
    return (
      <span {...style('array-key')} key={keySuffix}>
        <span className="array-key">{nameNode}</span>
        <span {...style('colon')}>:</span>
      </span>
    );
  }

  return (
    <span {...style('object-name')} key={keySuffix}>
      <span className="object-key">
        <span style={{ verticalAlign: 'top' }}>"</span>
        <span>{nameNode}</span>
        <span style={{ verticalAlign: 'top' }}>"</span>
      </span>
      <span {...style('colon')}>:</span>
    </span>
  );
};

/** мемоизация: props — примитивы и стабильная строка keySuffix. */
export const ObjectName = memo(ObjectNameBase);
