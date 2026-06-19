import { Tooltip } from 'antd';

import type { PcsBottomMenuProps } from './pcsBottomMenu.types';

import './PcsBottomMenu.scss';

export type {
  PcsBottomMenuAction,
  PcsBottomMenuActionBase,
  PcsBottomMenuPlacement,
  PcsBottomMenuProps,
} from './pcsBottomMenu.types';

const PcsBottomMenu = ({
  actions,
  ariaLabel = 'Действия',
  className,
  placement = 'inline',
}: PcsBottomMenuProps) => {
  const visibleActions = actions.filter((action) => !action.hidden);

  if (visibleActions.length === 0) return null;

  const rootClassName = [
    'pcs-bottom-menu',
    `pcs-bottom-menu--${placement}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div aria-label={ariaLabel} className={rootClassName} role="toolbar">
      {visibleActions.map((action) => {
        const itemClassName = [
          'pcs-bottom-menu__item',
          action.loading && 'pcs-bottom-menu__item--loading',
        ]
          .filter(Boolean)
          .join(' ');

        const button = (
          <button
            className={itemClassName}
            disabled={action.disabled || action.loading}
            type="button"
            onClick={action.onClick}
          >
            {action.loading && (
              <span className="pcs-bottom-menu__loader" aria-hidden />
            )}
            {!action.loading && action.icon && (
              <span className="pcs-bottom-menu__icon" aria-hidden>
                {action.icon}
              </span>
            )}
            <span className="pcs-bottom-menu__label">{action.label}</span>
          </button>
        );
        const actionContent = (
          <span className="pcs-bottom-menu__action">{button}</span>
        );

        if (!action.tooltip) {
          return (
            <span key={action.key} className="pcs-bottom-menu__action">
              {button}
            </span>
          );
        }

        return (
          <Tooltip key={action.key} title={action.tooltip}>
            {actionContent}
          </Tooltip>
        );
      })}
    </div>
  );
};

export default PcsBottomMenu;
