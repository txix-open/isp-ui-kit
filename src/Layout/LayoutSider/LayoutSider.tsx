import { Layout } from 'antd';
import { LayoutSiderPropsType } from './layout-sider';

const { Sider } = Layout;

import './layout-sider.scss';

const LayoutSider = ({
  collapsed,
  children,
  onCollapse,
}: LayoutSiderPropsType) => {
  return (
    <Sider
      className="layout-sider"
      width="250px"
      data-cy="layout-sider"
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={(value: boolean) => onCollapse(value)}
    >
      {children}
    </Sider>
  );
};

export default LayoutSider;
