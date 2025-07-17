import { Layout } from 'antd';
import { LayoutSiderPropsType } from './layout-sider';

const { Sider } = Layout;

import './layout-sider.scss';

const LayoutSider = ({
  children,
  theme = 'light',
  collapsible = true,
  ...rest
}: LayoutSiderPropsType) => {
  return (
    <Sider
      {...rest}
      className="layout-sider"
      width="250px"
      data-cy="layout-sider"
      theme={theme}
      collapsible={collapsible}
    >
      {children}
    </Sider>
  );
};

export default LayoutSider;
