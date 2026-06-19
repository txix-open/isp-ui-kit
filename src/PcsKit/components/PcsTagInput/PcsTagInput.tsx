import { useCallback, useEffect, useRef, useState } from 'react';

import type { PcsFieldSize } from '../../types/pcsField.types';
import PcsTagList from '../../ui/PcsTagList/PcsTagList';

import { PcsCloseMessageIcon } from '../../assets/icons';

import './PcsTagInput.scss';

export interface PcsTagInputProps {
  list: Record<string, string>;
  selected?: string[];
  placeholder?: string;
  maxLength?: number;
  size?: PcsFieldSize;
  readOnly?: boolean;
  disabled?: boolean;
  appended?: boolean;
  pattern?: RegExp;
  limit?: number;
  noHashtag?: boolean;
  onChange?: (selected: string[], newItem?: Record<string, string>) => void;
}

const isMatchingSearch = (value: string, search: string) =>
  value.toLowerCase().includes(search.toLowerCase());

const PcsTagInput = ({
  list = {},
  selected,
  placeholder = 'Введите тэг',
  maxLength = 64,
  size = 'md',
  readOnly = false,
  disabled = false,
  appended = false,
  pattern,
  limit = Infinity,
  noHashtag = false,
  onChange,
}: PcsTagInputProps) => {
  const [open, setOpen] = useState(false);
  const [internalSelectedState, setInternalSelectedState] = useState<string[]>(
    selected ?? [],
  );
  const internalSelected = selected ?? internalSelectedState;
  const [appendedItems, setAppendedItems] = useState<Record<string, string>>(
    {},
  );
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState<number | null>(null);

  const $input = useRef<HTMLInputElement>(null);
  const $list = useRef<HTMLUListElement>(null);
  const $parent = useRef<HTMLDivElement>(null);
  const $items = useRef<Record<number, HTMLLIElement>>({});

  const enrichedList = { ...list, ...appendedItems };

  const filtered = Object.keys(enrichedList)
    .filter((key) => !internalSelected.includes(key))
    .filter((key) => isMatchingSearch(enrichedList[key], search))
    .map((key) => ({ key, value: enrichedList[key] }));

  const handleDocumentClick = useCallback((e: MouseEvent) => {
    setOpen((prevOpen) => {
      if (!prevOpen) return prevOpen;
      const closest = (
        el: HTMLElement | null,
        fn: (el: HTMLElement) => boolean,
      ): HTMLElement | null =>
        el && (fn(el) ? el : closest(el.parentNode as HTMLElement, fn));
      const hitting = closest(
        e.target as HTMLElement,
        (el) => el === $parent.current,
      );
      if (!hitting) return false;
      $input.current?.focus();
      return true;
    });
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [handleDocumentClick]);

  const toggleSelected = (key: string) => {
    const index = internalSelected.indexOf(key);
    if (index === -1) {
      if (internalSelected.length >= limit) return { isChanged: false };
      return {
        selected: [...internalSelected, key].sort(),
        isChanged: true,
      };
    }
    return {
      selected: [
        ...internalSelected.slice(0, index),
        ...internalSelected.slice(index + 1),
      ],
      isChanged: true,
    };
  };

  const handleItemClick = (key: string, keepOpen = false) => {
    if (readOnly || disabled) return;
    const { selected: newSelected, isChanged } = toggleSelected(key);
    if (!isChanged || !newSelected) return;

    if (onChange) {
      onChange(newSelected, { [key]: enrichedList[key] });
    } else {
      setInternalSelectedState(newSelected);
    }
    setSearch('');
    if (!keepOpen) setOpen(false);
  };

  const handleEnter = () => {
    const value = $input.current?.value || '';
    if (!value) return;

    const regex =
      pattern ||
      (!noHashtag
        ? /^#([а-яА-ЯёЁa-zA-Z0-9]{1,254}|[1-9][0-9]{0,5}|)$/
        : /^([а-яА-ЯёЁa-zA-Z0-9]{1,254}|[1-9][0-9]{0,5}|)$/);

    if (internalSelected.length >= limit) return;

    const existingKey = Object.keys(enrichedList).find(
      (i) => enrichedList[i] === value,
    );
    if (existingKey) {
      return handleItemClick(existingKey);
    }

    if (!regex.test(value)) return;
    if (!appended) return;

    let newSelected = [...internalSelected];
    if (!newSelected.includes(value)) {
      newSelected = [...newSelected, value].sort();
    }
    const newItem = { [value]: value };

    if (onChange) {
      onChange(newSelected, newItem);
    } else {
      setInternalSelectedState(newSelected);
      setAppendedItems({ ...appendedItems, ...newItem });
    }
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const len = filtered.length;
    const isOpen = open && search && filtered.length > 0;
    let _position = position;

    const scroll = (pos: number) => {
      const parent = $list.current?.getBoundingClientRect();
      const element = $items.current[pos]?.getBoundingClientRect();
      if (!element || !parent) return;
      if (parent.bottom < element.bottom)
        $list.current?.scrollBy(0, element.bottom - parent.bottom);
      if (parent.top > element.top)
        $list.current?.scrollBy(0, element.top - parent.top);
    };

    switch (e.key) {
      case 'ArrowUp':
        _position = _position === null ? len - 1 : (_position + len - 1) % len;
        scroll(_position);
        e.preventDefault();
        break;
      case 'ArrowDown':
        _position = _position === null ? 0 : (_position + 1) % len;
        scroll(_position);
        e.preventDefault();
        break;
      case 'Tab':
        setOpen(false);
        return;
      case 'Enter':
        if (!isOpen || _position === null) return handleEnter();
        handleItemClick(filtered[_position].key);
        e.preventDefault();
        return;
      case 'Escape':
        setOpen(false);
        setSearch('');
        $input.current?.blur();
        return;
    }

    if (isOpen) setPosition(_position);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (pattern && !pattern.test(value)) return;
    setOpen(true);
    setSearch(value);
  };

  const handleClear = () => {
    setSearch('');
  };

  const handleRemoveTag = (key: string) => {
    handleItemClick(key, true);
  };

  const isOpen = open && search && filtered.length > 0;
  const selectedTags = internalSelected.map((key) => ({
    key,
    label: enrichedList[key] || key,
  }));

  return (
    <div
      ref={$parent}
      className={[
        'tag-input',
        `tag-input--${size}`,
        isOpen && 'open',
        disabled && 'disabled',
        readOnly && 'read-only',
      ]
        .filter(Boolean)
        .join(' ')}
      onKeyDown={handleKeyDown}
    >
      <div className="tag-input__input-wrapper">
        <input
          ref={$input}
          type="text"
          className="tag-input__input"
          value={search}
          onChange={handleSearchChange}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          maxLength={maxLength}
        />
        {search && !disabled && !readOnly && (
          <button
            className="tag-input__cleaner"
            type="button"
            onClick={handleClear}
          >
            <PcsCloseMessageIcon aria-hidden="true" />
          </button>
        )}
        {isOpen && (
          <ul ref={$list} className="tag-input__dropdown">
            {filtered.map((item, index) => (
              <li
                key={item.key}
                ref={(el) => {
                  if (el) $items.current[index] = el;
                }}
                className={`tag-input__item ${position === index ? 'position' : ''}`}
                onClick={() => handleItemClick(item.key)}
                onMouseOver={() => setPosition(index)}
                onMouseOut={() => setPosition(null)}
              >
                {item.value}
              </li>
            ))}
          </ul>
        )}
      </div>
      {internalSelected.length > 0 && (
        <PcsTagList
          className="tag-input__selected"
          closeLabel={(tag) => `Удалить тэг ${tag.label}`}
          removable={!readOnly && !disabled}
          tags={selectedTags}
          onRemove={(tag) => handleRemoveTag(tag.key)}
        />
      )}
    </div>
  );
};

export default PcsTagInput;
