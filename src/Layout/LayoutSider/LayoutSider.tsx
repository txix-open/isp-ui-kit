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
      width="250px"
      className="layout-sider"
      data-cy="layout-sider"
      theme={theme}
      collapsible={collapsible}
      {...rest}
    >
      {children}
    </Sider>
  );
};

export default LayoutSider;
