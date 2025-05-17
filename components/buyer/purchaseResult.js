import React from 'react';
import { useVending } from '@/context/VendingContext';
import { formatCentsToDollars } from '@/utils/currency';
import '@/styles/PurchaseResult.css';

const PurchaseResult = () => {
  const { purchaseDetail, changeMessage, clearPurchaseResult } = useVending();

  if (!purchaseDetail) return null;

  const { depositedAmount, totalSpent, products, note } = purchaseDetail;

  return (
    <div className="purchase-result">
      <div className="result-header">
        <h3>Purchase Successful!</h3>
        <button className="close-btn" onClick={clearPurchaseResult}>×</button>
      </div>
      
      <div className="purchase-summary">
        <p>Deposited amount: <strong>{formatCentsToDollars(depositedAmount)}</strong></p>
        <p>Total spent: <strong>{formatCentsToDollars(totalSpent)}</strong></p>
      </div>
      
      <div className="purchased-products">
        <h4>Products purchased:</h4>
        <ul>
          {products.map((product) => (
            <li key={product.productId}>
              {product.amount}x {product.productName} - {formatCentsToDollars(product.cost)}
            </li>
          ))}
        </ul>
      </div>
      
      {changeMessage && (
        <div className="change-info">
          <p>{changeMessage}</p>
        </div>
      )}
      
      {note && (
        <div className="note">
          <p>{note}</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseResult;
