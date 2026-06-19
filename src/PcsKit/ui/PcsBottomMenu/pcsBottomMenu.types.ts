import type { ReactNode } from 'react';

export type PcsBottomMenuPlacement = 'inline' | 'fixed';

export interface PcsBottomMenuActionBase {
  disabled?: boolean;
  hidden?: boolean;
  loading?: boolean;
  tooltip?: ReactNode;
  onClick: () => void;
}

export interface PcsBottomMenuAction extends PcsBottomMenuActionBase {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface PcsBottomMenuProps {
  actions: PcsBottomMenuAction[];
  ariaLabel?: string;
  className?: string;
  placement?: PcsBottomMenuPlacement;
}
