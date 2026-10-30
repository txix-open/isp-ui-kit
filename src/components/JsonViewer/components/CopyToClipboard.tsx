import { useEffect, useRef, useState } from 'react';

import { useViewer } from '../context';
import type { PublicNamespace } from '../utils/namespace';
import { toType } from '../utils/valueType';
import { Clippy } from './icons';

interface CopyToClipboardProps {
  src: unknown;
  /** Публичное namespace с корневым именем (для колбэка копирования). */
  namespace: PublicNamespace;
  hidden?: boolean;
}

const COPY_RESET_TIMEOUT = 5500;

const clipboardValue = (value: unknown): unknown => {
  const type = toType(value);
  if (type === 'function' || type === 'regexp') {
    return (value as { toString(): string }).toString();
  }
  return value;
};

const getCopyText = (src: unknown): string =>
  typeof src === 'string'
    ? src
    : JSON.stringify(clipboardValue(src), null, '  ');

/**
 * Fallback копирования (legacy-механизм), с исправлением: текст
 * записывается в .value, а не в innerHTML.
 */
const copyWithExecCommand = (text: string): void => {
  const container = document.createElement('textarea');
  container.value = text;
  document.body.appendChild(container);
  container.select();
  document.execCommand('copy');
  document.body.removeChild(container);
};

/** Копирование значения в буфер обмена (1:1 порт legacy). */
export const CopyToClipboard = ({
  src,
  namespace,
  hidden,
}: CopyToClipboardProps) => {
  const { style, enableClipboard } = useViewer();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const handleCopy = () => {
    const text = getCopyText(src);
    const fallback = () => copyWithExecCommand(text);

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(fallback);
    } else {
      fallback();
    }

    timerRef.current = setTimeout(() => {
      setCopied(false);
    }, COPY_RESET_TIMEOUT);
    setCopied(true);

    if (typeof enableClipboard === 'function') {
      enableClipboard({
        src: src as object,
        namespace,
        name: namespace[namespace.length - 1] ?? null,
      });
    }
  };

  return (
    <span className="copy-to-clipboard-container" title="Copy to clipboard">
      <span
        style={{
          ...style('copy-to-clipboard').style,
          display: hidden ? 'none' : 'inline',
        }}
        onClick={handleCopy}
      >
        {copied ? (
          <span>
            <Clippy className="copy-icon" {...style('copy-icon')} />
            <span {...style('copy-icon-copied')}>✔</span>
          </span>
        ) : (
          <Clippy className="copy-icon" {...style('copy-icon')} />
        )}
      </span>
    </span>
  );
};
