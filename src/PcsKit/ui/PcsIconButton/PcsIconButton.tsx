import type { ButtonHTMLAttributes, ReactNode } from 'react';

import './PcsIconButton.scss';

export type PcsIconButtonVariant = 'primary' | 'secondary' | 'ghost';
export type PcsIconButtonSize = 'default' | 'compact';

export interface PcsIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: PcsIconButtonVariant;
  size?: PcsIconButtonSize;
}

const PcsIconButton = ({
  icon,
  variant = 'secondary',
  size = 'default',
  className,
  type = 'button',
  ...props
}: PcsIconButtonProps) => {
  const rootClassName = [
    'pcs-icon-button',
    `pcs-icon-button--${variant}`,
    `pcs-icon-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={rootClassName} type={type} {...props}>
      <span className="pcs-icon-button__icon">{icon}</span>
    </button>
  );
};

export default PcsIconButton;
