import { memo, useMemo } from 'react';

import { useViewer } from '../context';
import { useStoreFlag } from '../state/ViewerStore';
import type { JsonPath } from '../utils/immutable';
import { namespaceKey } from '../utils/namespace';
import { Highlight } from './Highlight';

/**
 * Отображатели значений типов (1:1 порт legacy DataTypes/*.jsx).
 *
 * nodePath — путь самого значения от корня src; используется как ключ
 * хранилища для свёртывания строк и функций (в legacy ключом был путь
 * контейнера, из-за чего значения одного контейнера делили состояние).
 */

interface ValueComponentProps {
  value: unknown;
  nodePath: JsonPath;
}

const DataTypeLabel = ({ type_name }: { type_name: string }) => {
  const { style, displayDataTypes } = useViewer();
  if (displayDataTypes) {
    return (
      <span className="data-type-label" {...style('data-type-label')}>
        {type_name}
      </span>
    );
  }
  return null;
};

/** Строка с обрезкой длинных значений по collapseStringsAfterLength. */
const JsonStringBase = ({ value, nodePath }: ValueComponentProps) => {
  const { style, store, collapseStringsAfterLength, virtual, search } =
    useViewer();
  const pathKey = useMemo(() => namespaceKey(nodePath), [nodePath]);
  const collapsed = useStoreFlag(store, 'stringCollapsed', pathKey, true);

  const text = value as string;
  const limit =
    typeof collapseStringsAfterLength === 'number'
      ? collapseStringsAfterLength
      : false;
  const collapsible = limit !== false && text.length > limit;

  const display =
    collapsible && collapsed ? (
      <span>
        {text.substring(0, limit as number)}
        <span {...style('ellipsis')}>{' ...'}</span>
      </span>
    ) : (
      <Highlight text={text} search={search} />
    );

  return (
    <div {...style('string')}>
      <DataTypeLabel type_name="string" />
      <span
        className="string-value"
        style={{ cursor: collapsible ? 'pointer' : 'default' }}
        onClick={
          collapsible && !virtual
            ? () => store.set('stringCollapsed', pathKey, !collapsed)
            : undefined
        }
      >
        `"{display}"`
      </span>
    </div>
  );
};

export const JsonString = memo(JsonStringBase);

const JsonIntegerBase = ({ value }: ValueComponentProps) => {
  const { style, search } = useViewer();
  return (
    <div {...style('integer')}>
      <DataTypeLabel type_name="int" />
      <Highlight text={String(value)} search={search} />
    </div>
  );
};

export const JsonInteger = memo(JsonIntegerBase);

const JsonFloatBase = ({ value }: ValueComponentProps) => {
  const { style, search } = useViewer();
  return (
    <div {...style('float')}>
      <DataTypeLabel type_name="float" />
      <Highlight text={String(value)} search={search} />
    </div>
  );
};

export const JsonFloat = memo(JsonFloatBase);

const JsonBooleanBase = ({ value }: ValueComponentProps) => {
  const { style } = useViewer();
  return (
    <div {...style('boolean')}>
      <DataTypeLabel type_name="bool" />
      {value ? 'true' : 'false'}
    </div>
  );
};

export const JsonBoolean = memo(JsonBooleanBase);

export const JsonNull = () => {
  const { style } = useViewer();
  return <div {...style('null')}>NULL</div>;
};

export const JsonNan = () => {
  const { style } = useViewer();
  return <div {...style('nan')}>NaN</div>;
};

export const JsonUndefined = () => {
  const { style } = useViewer();
  return <div {...style('undefined')}>undefined</div>;
};

const DATE_DISPLAY_OPTIONS = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
} as const;

const JsonDateBase = ({ value }: ValueComponentProps) => {
  const { style } = useViewer();
  return (
    <div {...style('date')}>
      <DataTypeLabel type_name="date" />
      <span className="date-value" {...style('date-value')}>
        {(value as Date).toLocaleTimeString('en-us', DATE_DISPLAY_OPTIONS)}
      </span>
    </div>
  );
};

export const JsonDate = memo(JsonDateBase);

const JsonRegexpBase = ({ value }: ValueComponentProps) => {
  const { style } = useViewer();
  return (
    <div {...style('regexp')}>
      <DataTypeLabel type_name="regexp" />
      {(value as { toString(): string }).toString()}
    </div>
  );
};

export const JsonRegexp = memo(JsonRegexpBase);

/**
 * Функция с свёртыванием тела: по умолчанию показывается только
 * сигнатура (legacy: slice(9, -1) от строки функции).
 */
const JsonFunctionBase = ({ value, nodePath }: ValueComponentProps) => {
  const { style, store, virtual } = useViewer();
  const pathKey = useMemo(() => namespaceKey(nodePath), [nodePath]);
  const collapsed = useStoreFlag(store, 'functionCollapsed', pathKey, true);

  const source = (value as { toString(): string }).toString().slice(9, -1);

  return (
    <div {...style('function')}>
      <DataTypeLabel type_name="function" />
      <span
        {...style('function-value')}
        className="rjv-function-container"
        onClick={
          virtual
            ? undefined
            : () => store.set('functionCollapsed', pathKey, !collapsed)
        }
      >
        {collapsed ? (
          <span>
            {source.replace(/\{[\s\S]+/, '')}
            <span className="function-collapsed" style={{ fontWeight: 'bold' }}>
              <span>{'{'}</span>
              <span {...style('ellipsis')}>...</span>
              <span>{'}'}</span>
            </span>
          </span>
        ) : (
          source
        )}
      </span>
    </div>
  );
};

export const JsonFunction = memo(JsonFunctionBase);

/**
 * Предпросмотр «{ ... }» / «[ ... ]» в редакторе значений
 * (legacy getDetectedInput для типов object/array).
 */
export const BracesPreview = ({ kind }: { kind: 'object' | 'array' }) => {
  const { style } = useViewer();
  const open = kind === 'object' ? '{' : '[';
  const close = kind === 'object' ? '}' : ']';

  return (
    <span>
      <span style={{ ...style('brace').style, cursor: 'default' }}>{open}</span>
      <span style={{ ...style('ellipsis').style, cursor: 'default' }}>...</span>
      <span style={{ ...style('brace').style, cursor: 'default' }}>
        {close}
      </span>
    </span>
  );
};
