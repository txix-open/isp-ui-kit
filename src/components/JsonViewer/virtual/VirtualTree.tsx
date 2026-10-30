import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

import { useViewer } from '../context';
import { ValueEditor } from '../components/ValueEditor';
import type { ParsedInput } from '../utils/parseInput';
import { parseInput } from '../utils/parseInput';
import { stringifyVariable } from '../utils/stringifyVariable';
import { FlatRow } from './FlatRow';
import {
  flatRowKey,
  flattenTree,
  type EditorTarget,
  type FlatRow as FlatRowData,
} from './flatten';

/** Оценка высоты строки до первого измерения. */
const ROW_HEIGHT_FALLBACK = 26;
/** Сколько строк рисовать за пределами видимой области. */
const OVERSCAN = 12;

interface VirtualTreeProps {
  src: unknown;
  rootName: string | number | false | null;
  /** Высота скролл-контейнера в px (виртуализованный режим). */
  maxHeight: number;
}

type TextOverlay = { kind: 'text'; text: string; top: number; rowKey: string };
type EditorOverlay = {
  kind: 'editor';
  target: EditorTarget;
  top: number;
  rowKey: string;
};
type OverlayState = TextOverlay | EditorOverlay | null;

/**
 * Виртуализованное дерево (prop maxHeight): плоский список строк
 * (flattenTree) + окно отрисовки вокруг скролла. Состояние/действия —
 * те же store и actions, что в обычном режиме.
 */
export const VirtualTree = ({ src, rootName, maxHeight }: VirtualTreeProps) => {
  const ctx = useViewer();
  const {
    style,
    store,
    collapsed,
    shouldCollapse,
    sortKeys,
    groupArraysAfterLength,
    indentWidth,
    searchExpandKeys,
  } = ctx;

  // Любая смена флага store → перестроение плоского списка
  const storeVersion = useSyncExternalStore(store.subscribe, () =>
    store.getGlobalVersion(),
  );

  const rows = useMemo(
    () =>
      flattenTree(
        src,
        {
          rootName,
          collapsed,
          shouldCollapse,
          sortKeys,
          groupArraysAfterLength,
          indentWidth,
        },
        store,
        searchExpandKeys,
      ),
    // storeVersion — триггер перестроения при смене флагов store
    [
      src,
      rootName,
      collapsed,
      shouldCollapse,
      sortKeys,
      groupArraysAfterLength,
      indentWidth,
      store,
      searchExpandKeys,
      storeVersion,
    ],
  );

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const firstRowRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const scrollRaf = useRef<number | null>(null);

  const [rowHeight, setRowHeight] = useState(ROW_HEIGHT_FALLBACK);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState(0);

  // Высота строки одна у всех (однострочные значения) — меряем первую
  useLayoutEffect(() => {
    const el = firstRowRef.current;
    if (el && el.offsetHeight > 0) {
      setRowHeight(el.offsetHeight);
    }
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (el) {
      setScrollTop(el.scrollTop);
      setViewport(el.clientHeight);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollRaf.current !== null) {
      return;
    }
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = null;
      updateScrollState();
    });
  }, [updateScrollState]);

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) {
      return undefined;
    }
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (scrollRaf.current !== null) {
        cancelAnimationFrame(scrollRaf.current);
      }
    };
  }, [updateScrollState]);

  // --- окно отрисовки ---

  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN);
  const end = Math.min(
    rows.length,
    Math.ceil((scrollTop + viewport) / rowHeight) + OVERSCAN,
  );
  const visibleRows = rows.slice(start, end);

  // --- overlay (полный текст значения / редактор) ---

  const [overlay, setOverlay] = useState<OverlayState>(null);
  const [editValue, setEditValue] = useState('');
  const [parsedInput, setParsedInput] = useState<ParsedInput>({
    type: false,
    value: null,
  });

  const openTextOverlay = useCallback(
    (r: FlatRowData, text: string, top: number) => {
      setOverlay({ kind: 'text', text, top: top + 2, rowKey: flatRowKey(r) });
    },
    [],
  );

  const openEditorRequest = useCallback(
    (target: EditorTarget, top: number, rowKey: string) => {
      const initial = stringifyVariable(
        target.kind === 'value' ? target.value : target.src,
      );
      setEditValue(initial);
      setParsedInput(parseInput(initial));
      setOverlay({ kind: 'editor', target, top: top + 2, rowKey });
    },
    [],
  );

  const commitEditor = useCallback(
    (submitDetected: boolean) => {
      if (overlay?.kind !== 'editor') {
        return;
      }
      const target = overlay.target;
      const newValue =
        submitDetected && parsedInput.type ? parsedInput.value : editValue;
      setOverlay(null);
      if (target.kind === 'value') {
        ctx.actions.editVariable(
          target.parentPath,
          target.name,
          newValue,
          target.value,
        );
      } else {
        ctx.actions.editBranch(target.nodePath, newValue, target.src);
      }
    },
    [overlay, editValue, parsedInput, ctx.actions],
  );

  // Строка overlay покинула окно (скролл/данные) — закрываем
  useEffect(() => {
    if (overlay === null) {
      return;
    }
    for (let i = start; i < end; i += 1) {
      if (flatRowKey(rows[i]) === overlay.rowKey) {
        return;
      }
    }
    setOverlay(null);
  }, [overlay, rows, start, end]);

  // Escape закрывает текстовый overlay
  useEffect(() => {
    if (overlay === null || overlay.kind !== 'text') {
      return undefined;
    }
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOverlay(null);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [overlay]);

  const handleScrollerMouseDown = (e: ReactMouseEvent) => {
    if (overlay === null) {
      return;
    }
    if (overlayRef.current && overlayRef.current.contains(e.target as Node)) {
      return;
    }
    setOverlay(null);
  };

  const overlayStyle: CSSProperties = {
    left: 12,
    right: 4,
    maxHeight: Math.max(120, viewport - 16),
    ...style('rjv-overlay').style,
  };

  return (
    <div
      ref={scrollerRef}
      className="rjv-scroller"
      style={{ maxHeight, overflowY: 'auto', position: 'relative' }}
      onScroll={handleScroll}
      onMouseDown={handleScrollerMouseDown}
    >
      <div
        className="rjv-rows"
        style={{ position: 'relative', height: rows.length * rowHeight }}
      >
        {visibleRows.map((r, i) => {
          const index = start + i;
          return (
            <FlatRow
              key={flatRowKey(r)}
              row={r}
              top={index * rowHeight}
              firstRef={
                i === 0
                  ? (el) => {
                      firstRowRef.current = el;
                    }
                  : undefined
              }
              onTextOverlay={openTextOverlay}
              onEditRequest={openEditorRequest}
            />
          );
        })}
        {overlay !== null ? (
          <div
            ref={overlayRef}
            className="rjv-overlay"
            style={{ top: overlay.top, ...overlayStyle }}
          >
            {overlay.kind === 'text' ? (
              <div
                className="rjv-overlay-text"
                {...style('rjv-overlay-text')}
                onClick={() => {
                  setOverlay(null);
                }}
              >
                {overlay.text}
              </div>
            ) : (
              <ValueEditor
                value={editValue}
                parsedInput={parsedInput}
                nodePath={
                  overlay.target.kind === 'value'
                    ? [...overlay.target.parentPath, overlay.target.name]
                    : overlay.target.nodePath
                }
                mainCheckDetected={overlay.target.kind === 'branch'}
                onChange={(v) => {
                  setEditValue(v);
                  setParsedInput(parseInput(v));
                }}
                onCommit={commitEditor}
                onCancel={() => {
                  setOverlay(null);
                }}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
