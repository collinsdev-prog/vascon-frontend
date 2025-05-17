'use client';

import { useAuth } from '@/context/AuthContext';
import { useVending } from '@/context/VendingContext';
import ProductsList from '@/components/products/ProductList';
import PurchaseResult from '@/components/buyer/purchaseResult';
import Alert from '@/components/ui/Alert';
import { formatCentsToDollars } from '@/utils/currency'; 
import '@/styles/Products.css';

const ProductsPage = () => {
  const { user, isAuthenticated, isSeller, isBuyer } = useAuth();
  const { deposit, changeMessage, purchaseDetail } = useVending();
  
  return (
    <div className="products-page">
      {changeMessage && (
        <Alert type="info" className="change-message-alert">
          {changeMessage}
        </Alert>
      )}
      
      {purchaseDetail && <PurchaseResult result={purchaseDetail} />}
      
      <h2 className="page-title">Available Products</h2>
      
      {isAuthenticated && (
        <div className="user-info">
          {isBuyer && (
            <div className="balance-info">
              Balance: <span className="balance-amount">{formatCentsToDollars(deposit)}</span>
            </div>
          )}
          
          {isSeller && (
            <div className="seller-info">
              Manage Your Products
            </div>
          )}
        </div>
      )}
      
      {!isAuthenticated && (
        <div className="login-prompt">
          Please log in or register to make purchases.
        </div>
      )}
      
      <ProductsList />
    </div>
  );
};

export default ProductsPage;