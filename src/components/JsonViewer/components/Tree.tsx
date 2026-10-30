import { useViewer } from '../context';
import { toType } from '../utils/valueType';
import { ArrayGroup } from './ArrayGroup';
import { Node } from './Node';

interface TreeProps {
  src: unknown;
  /** Валидированное имя корня (false/null — без имени). */
  rootName: string | number | false | null;
}

/**
 * Корневая обвязка дерева (1:1 порт legacy JsonViewer.jsx):
 * выбирает Node или ArrayGroup для корня и задаёт root namespace.
 */
export const Tree = ({ src, rootName }: TreeProps) => {
  const { groupArraysAfterLength } = useViewer();

  const type = toType(src);
  const rootSegment = rootName === false || rootName === null ? null : rootName;
  const namespace: Array<string | number | null> = [rootSegment];

  const useGroup =
    groupArraysAfterLength !== 0 &&
    Array.isArray(src) &&
    src.length > groupArraysAfterLength;

  return (
    <div className="pretty-json-container object-container">
      <div className="object-content">
        {useGroup ? (
          <ArrayGroup
            src={src}
            name={rootName}
            namespace={namespace}
            depth={0}
            jsvRoot
            type="array"
          />
        ) : (
          <Node
            src={src}
            name={rootName}
            namespace={namespace}
            depth={0}
            jsvRoot
            type={type === 'array' ? 'array' : undefined}
          />
        )}
      </div>
    </div>
  );
};
