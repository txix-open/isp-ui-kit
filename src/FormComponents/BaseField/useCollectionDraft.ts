import { useEffect, useRef, useState } from 'react';

type DraftRow<T> = { key: number; value: T };

// Keep blank rows locally while synchronizing external setValue/reset updates.
export default function useCollectionDraft<T>(
  name: string,
  value: unknown,
  fromValue: (value: unknown) => T[],
  toValue: (rows: T[]) => unknown,
  onChange: (value: unknown) => void,
) {
  const sequence = useRef(0);
  const rowControls = useRef(new Map<number, { focus: () => void }>());
  const addControl = useRef<{ focus: () => void } | null>(null);
  const pendingFocus = useRef<number | null | undefined>(undefined);
  const emitted = useRef<{
    name: string;
    signature: string | undefined;
  } | null>(null);
  const makeRows = (items: T[]) =>
    items.map((value) => ({ key: sequence.current++, value }));
  const [rows, setRows] = useState<DraftRow<T>[]>(() =>
    makeRows(fromValue(value)),
  );

  useEffect(() => {
    const ownUpdate = emitted.current;
    emitted.current = null;
    if (
      ownUpdate?.name === name &&
      ownUpdate.signature === JSON.stringify(value)
    )
      return;
    setRows(
      fromValue(value).map((value) => ({ key: sequence.current++, value })),
    );
  }, [name, value, fromValue]);

  const publish = (next: DraftRow<T>[]) => {
    const nextValue = toValue(next.map((row) => row.value));
    emitted.current = { name, signature: JSON.stringify(nextValue) };
    setRows(next);
    onChange(nextValue);
  };

  useEffect(() => {
    const key = pendingFocus.current;
    if (key === undefined) return;
    pendingFocus.current = undefined;
    const target =
      key === null ? addControl.current : rowControls.current.get(key);
    target?.focus();
  }, [rows]);

  return {
    rows,
    rowRef: (key: number, node: { focus: () => void } | null) => {
      if (node) rowControls.current.set(key, node);
      else rowControls.current.delete(key);
    },
    addRef: (node: { focus: () => void } | null) => {
      addControl.current = node;
    },
    add: (value: T) => {
      const added = makeRows([value]);
      pendingFocus.current = added[0].key;
      setRows([...rows, ...added]);
    },
    remove: (key: number) => {
      const index = rows.findIndex((row) => row.key === key);
      const next = rows.filter((row) => row.key !== key);
      pendingFocus.current =
        next[Math.min(index, next.length - 1)]?.key ?? null;
      publish(next);
    },
    update: (key: number, value: T) =>
      publish(rows.map((row) => (row.key === key ? { ...row, value } : row))),
  };
}
