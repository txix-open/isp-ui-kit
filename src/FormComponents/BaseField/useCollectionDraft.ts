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

  return {
    rows,
    add: (value: T) => setRows([...rows, ...makeRows([value])]),
    remove: (key: number) => publish(rows.filter((row) => row.key !== key)),
    update: (key: number, value: T) =>
      publish(rows.map((row) => (row.key === key ? { ...row, value } : row))),
  };
}
