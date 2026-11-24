import { useState } from 'react';

import { useViewer } from '../context';
import { Add as Cancel, CheckCircle } from './icons';

interface KeyModalProps {
  /** Стартовое значение поля (для переименования — текущий ключ). */
  initialInput: string;
  /** Валидация имени ключа. */
  isValid: (input: string) => boolean;
  /** Подтверждение (Enter / иконка галочки). */
  onSubmit: (input: string) => void;
  /** Закрытие (клик по фону, Escape, крестик). */
  onClose: () => void;
}

/**
 * Модалка добавления/переименования ключа (1:1 порт legacy
 * ObjectKeyModal/ObjectKeyModal.jsx).
 */
export const KeyModal = ({
  initialInput,
  isValid,
  onSubmit,
  onClose,
}: KeyModalProps) => {
  const { style } = useViewer();
  const [input, setInput] = useState(initialInput);

  const valid = isValid(input);

  return (
    <div
      className="key-modal-request"
      {...style('key-modal-request')}
      onClick={onClose}
    >
      <div
        {...style('key-modal')}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div {...style('key-modal-label')}>Key Name:</div>
        <div style={{ position: 'relative' }}>
          <input
            {...style('key-modal-input')}
            className="key-modal-input"
            ref={(el) => {
              if (el) {
                el.focus();
              }
            }}
            spellCheck={false}
            value={input}
            placeholder="..."
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (valid && e.key === 'Enter') {
                onSubmit(input);
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
          />
          {valid ? (
            <CheckCircle
              {...style('key-modal-submit')}
              className="key-modal-submit"
              onClick={() => {
                onSubmit(input);
              }}
            />
          ) : null}
        </div>
        <span {...style('key-modal-cancel')}>
          <Cancel
            {...style('key-modal-cancel-icon')}
            className="key-modal-cancel"
            onClick={onClose}
          />
        </span>
      </div>
    </div>
  );
};
