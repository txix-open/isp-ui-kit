import type { ReactNode } from 'react';

import { useViewer } from '../context';

interface HighlightProps {
  text: string;
  /** Запрос поиска; пустая строка — подсветка выключена. */
  search: string;
}

const escapeRegExp = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Подсветка вхождений запроса поиска (prop search) в тексте: все
 * вхождения (без учёта регистра) оборачиваются в span search-match.
 */
export const Highlight = ({ text, search }: HighlightProps): ReactNode => {
  const { style } = useViewer();
  const query = search.trim().toLowerCase();

  if (query === '' || text === '') {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="search-match" {...style('search-match')}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};
