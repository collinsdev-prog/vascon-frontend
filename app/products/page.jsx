'use client';

import { useAuth } from '@/context/AuthContext';
import { useVending } from '@/context/VendingContext';
import ProductsList from '@/components/products/ProductList';
import '@/styles/Products.css';

const ProductsPage = () => {
  const { user, isAuthenticated, isSeller, isBuyer } = useAuth();
  const { deposit } = useVending();
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Available Products</h1>
        {isAuthenticated && (
          <div className="user-info">
            {isBuyer && (
              <div className="deposit-badge">
                Balance: {deposit}¢
              </div>
            )}
            {isSeller && (
              <a href="/products/manage" className="manage-link">
                Manage Your Products
              </a>
            )}
          </div>
        )}
      </div>
      
      {!isAuthenticated && (
        <div className="auth-banner">
          <p>Please <a href="/login">log in</a> or <a href="/register">register</a> to make purchases.</p>
        </div>
      )}
      
      <ProductsList />
    </div>
  );
};

export default ProductsPage;