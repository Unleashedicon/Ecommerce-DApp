import { Outlet } from 'react-router-dom';
import ProductGrid from './index';

const Layout = () => (
  <div className="wrapper">
    <ProductGrid />
    <Outlet />
  </div>
);
export default Layout;
