import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import type { ModalProps } from 'antd';
import type { CSSProperties } from 'react';
import type { ReactNode } from 'react';

import './PcsModal.scss';

export type PcsModalFooterLayout = 'inline' | 'equal';
export type PcsModalVariant = 'default' | 'confirm';

export interface PcsModalProps extends Omit<
  ModalProps,
  'footer' | 'onCancel' | 'open'
> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  footerClassName?: string;
  footerLayout?: PcsModalFooterLayout;
  variant?: PcsModalVariant;
}

const PcsModal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  footerClassName,
  footerLayout = 'inline',
  variant = 'default',
  className,
  style,
  width = 1000,
  ...rest
}: PcsModalProps) => {
  const rootClassName = [
    'pcs-modal',
    variant !== 'default' && `pcs-modal--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const footerRootClassName = [
    'pcs-modal__footer',
    `pcs-modal__footer--${footerLayout}`,
    footerClassName,
  ]
    .filter(Boolean)
    .join(' ');
  const modalStyle = {
    ...style,
    '--pcs-modal-content-width':
      typeof width === 'number' ? `${width}px` : String(width),
  } as CSSProperties;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={title}
      closeIcon={<CloseOutlined className="pcs-modal__close-icon" />}
      footer={null}
      centered={false}
      width="100%"
      className={rootClassName}
      style={modalStyle}
      {...rest}
    >
      {description && <p className="pcs-modal__description">{description}</p>}
      {children}
      {footer && <div className={footerRootClassName}>{footer}</div>}
    </Modal>
  );
};

export default PcsModal;
