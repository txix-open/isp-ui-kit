import { Layout } from 'antd';
import { LayoutSiderPropsType } from './layout-sider';

const { Sider } = Layout;

import './layout-sider.scss';

const LayoutSider = ({
  children,
  theme = 'light',
  collapsible = true,
  className,
  ...rest
}: LayoutSiderPropsType) => {
  return (
    <Sider
      width="250px"
      className={['layout-sider', className].filter(Boolean).join(' ')}
      data-cy="layout-sider"
      theme={theme}
      collapsible={collapsible}
      trigger={
        <button
          type="button"
          className="layout-sider__toggle"
          aria-label="Свернуть или развернуть боковую панель"
          title="Свернуть или развернуть боковую панель"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="m12 5-5 5 5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      }
      {...rest}
    >
      {children}
    </Sider>
  );
};

export default LayoutSider;
