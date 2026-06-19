import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { PcsExportTableIcon } from '../../assets/icons';

import './PcsExport.scss';

export type PcsExportOption = number | 'all';

export interface PcsExportProps {
  options?: PcsExportOption[];
  buttonTitle?: string;
  className?: string;
  onExport: (count: PcsExportOption) => void;
}

const DEFAULT_EXPORT_OPTIONS: PcsExportOption[] = [50, 100, 500, 'all'];
const MENU_OFFSET = 5;

const getExportLabel = (option: PcsExportOption) =>
  option === 'all' ? 'выгрузить все' : `выгрузить ${option}`;

const PcsExport = ({
  options = DEFAULT_EXPORT_OPTIONS,
  buttonTitle = 'Выгрузить список',
  className,
  onExport,
}: PcsExportProps) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = useCallback(() => {
    const rootElement = rootRef.current;

    if (!rootElement) {
      return;
    }

    const rect = rootElement.getBoundingClientRect();

    setMenuPosition({
      left: rect.left,
      top: rect.bottom + MENU_OFFSET,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updateMenuPosition();

    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      if (rootRef.current || menuRef.current) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleExport = (option: PcsExportOption) => {
    onExport(option);
    setOpen(false);
  };

  const handleToggle = () => {
    if (!open) {
      updateMenuPosition();
    }

    setOpen((isOpen) => !isOpen);
  };

  const rootClassName = `pcs-export${open ? ' pcs-export--open' : ''}${
    className ? ` ${className}` : ''
  }`;

  return (
    <div ref={rootRef} className={rootClassName}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="pcs-export__button"
        title={buttonTitle}
        type="button"
        onClick={handleToggle}
      >
        <PcsExportTableIcon className="pcs-export__icon" aria-hidden="true" />
      </button>
      {open &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            className="pcs-export__menu"
            role="menu"
            style={menuPosition}
          >
            {options.map((option) => (
              <button
                key={String(option)}
                className="pcs-export__menu-item"
                role="menuitem"
                type="button"
                onClick={() => handleExport(option)}
              >
                {getExportLabel(option)}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default PcsExport;
