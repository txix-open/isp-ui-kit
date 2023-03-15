import { FC, ReactNode } from 'react';
import './MyButton.scss';
import { Button, ButtonProps } from 'antd';

export interface MyButtonProps extends ButtonProps {
  children?: ReactNode;
  color: string;
  big?: boolean;
}

const MyButton: FC<MyButtonProps> = ({
  children = null,
  color,
  big = false,
  ...props
}) => {
  const rootClasses = ['my-button'];
  if (big) {
    rootClasses.push('big-btn');
  }

  return (
    <Button {...props} className={rootClasses.join(' ')} style={{ color }}>
      {children}
    </Button>
  );
};

export default MyButton;
