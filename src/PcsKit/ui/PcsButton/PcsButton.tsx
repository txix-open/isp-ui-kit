import type { ButtonHTMLAttributes, ReactNode } from 'react';

import './PcsButton.scss';

export type PcsButtonVariant =
  | 'white'
  | 'silver'
  | 'lightblue'
  | 'lightgray'
  | 'green'
  | 'greenNegative'
  | 'redNegative'
  | 'pink'
  | 'orange'
  | 'transparent'
  | 'link';

export interface PcsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  hidden?: boolean;
  icon?: ReactNode;
  loading?: boolean;
  variant?: PcsButtonVariant;
}

const PcsButton = ({
  children,
  className,
  disabled,
  hidden,
  icon,
  loading = false,
  type = 'button',
  variant = 'silver',
  ...props
}: PcsButtonProps) => {
  if (hidden) return null;

  const rootClassName = [
    'pcs-button',
    `pcs-button--${variant}`,
    icon && 'pcs-button--with-icon',
    children !== undefined && 'pcs-button--with-label',
    loading && 'pcs-button--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={rootClassName}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && <span className="pcs-button__spinner" />}
      {icon && <span className="pcs-button__icon">{icon}</span>}
      {children !== undefined && (
        <span className="pcs-button__label">{children}</span>
      )}
    </button>
  );
};

export default PcsButton;
