import { Routes, Route } from 'react-router-dom';
import ProductGrid from './index';
import Layout from './layout';
import Login from '../Routes/Login';
import Checkout from '../Routes/Checkout';
import NotMatch from '../Routes/NotMatch';
import { AuthProvider } from '../context/AuthContext';

const EcommerceApp = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProductGrid />} />
      </Route>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotMatch />} />
    </Routes>
  </AuthProvider>
);

export default EcommerceApp;
