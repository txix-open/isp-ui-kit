import { useViewer } from '../context';
import { Add } from './icons';

interface ValidationFailureProps {
  active: boolean;
  message: string;
}

/**
 * Баннер валидации при отказе в onEdit/onAdd/onDelete.
 * Клик сбрасывает его (legacy RESET).
 */
export const ValidationFailure = ({
  active,
  message,
}: ValidationFailureProps) => {
  const { style, actions } = useViewer();

  if (!active) {
    return null;
  }

  return (
    <div
      className="validation-failure"
      {...style('validation-failure')}
      onClick={() => {
        actions.reset();
      }}
    >
      <span {...style('validation-failure-label')}>{message}</span>
      <Add {...style('validation-failure-clear')} />
    </div>
  );
};
