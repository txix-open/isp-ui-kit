import { ThreeColumnProps } from './three-column.type';

import './three-column.scss';

const ThreeColumn = ({ children, ...rest }: ThreeColumnProps) => (
  <section className="three-columns" {...rest}>
    {children}
  </section>
);

export default ThreeColumn;
