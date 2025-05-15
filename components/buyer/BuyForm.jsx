import React, { useState, useEffect } from 'react';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';

const BuyForm = ({ product, products, userDeposit, onBuy }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determine if we're in single product mode or selection mode
  const isSingleProductMode = !!product;
  
  // If in selection mode and products are available, set the first one as default
  useEffect(() => {
    if (!isSingleProductMode && products && products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId, isSingleProductMode]);
  
  // Get the current product based on mode
  const currentProduct = isSingleProductMode 
    ? product 
    : products?.find(p => p.id == selectedProductId) || null;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (quantity < 1) {
        setError('Quantity must be at least 1');
        setIsSubmitting(false);
        return;
      }
      
      if (!currentProduct) {
        setError('Please select a product');
        setIsSubmitting(false);
        return;
      }

      // Check if user has enough deposit
      const totalCost = currentProduct.cost * quantity;
      if (userDeposit < totalCost) {
        setError(`Insufficient funds. You need ${totalCost} cents, but have ${userDeposit} cents.`);
        setIsSubmitting(false);
        return;
      }

      // Check if product has enough in stock
      if (currentProduct.amountAvailable < quantity) {
        setError(`Not enough stock. Only ${currentProduct.amountAvailable} available.`);
        setIsSubmitting(false);
        return;
      }

      // Call the handleBuy method from VendingContext
      await onBuy(currentProduct.id, quantity);
      
      // Reset quantity after successful purchase
      setQuantity(1);
      
      // Only clear selection in multi-product mode
      if (!isSingleProductMode && products && products.length > 0) {
        setSelectedProductId(products[0].id);
      }
    } catch (err) {
      // Handle purchase errors
      setError(err.response?.data?.message || 'Failed to complete purchase');
      console.error('Purchase error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display nothing if no data is available
  if (!isSingleProductMode && (!products || products.length === 0)) {
    return <Alert type="info">No products available</Alert>;
  }
  if (isSingleProductMode && !product) {
    return null;
  }

  return (
    <div className="buy-form">
      {/* In dropdown mode, we don't show product details as they'll be shown elsewhere */}
      {isSingleProductMode && (
        <div className="product-card">
          <h3>{product.productName || product.name}</h3>
          <p className="product-cost">{product.cost} cents</p>
          <p className="product-seller">Seller: {product.sellerName || product.sellerId || 'Unknown'}</p>
          <p className="product-available">Available: {product.amountAvailable}</p>
        </div>
      )}
      
      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleSubmit} className="buy-form__controls">
        {/* Product selector dropdown - only in multi-product mode */}
        {!isSingleProductMode && (
          <div className="form-group">
            <label htmlFor="product-select">Select Product</label>
            <select
              id="product-select"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="form-control"
              required
            >
              <option value="">-- Select Product --</option>
              {products && products.map(prod => (
                <option key={prod.id} value={prod.id}>
                  {prod.productName || prod.name} - {prod.cost} cents
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity input - always shown */}
        <div className="form-group">
          <label htmlFor={`quantity-input-${isSingleProductMode ? product.id : 'selected'}`}>
            Quantity
          </label>
          <input
            id={`quantity-input-${isSingleProductMode ? product.id : 'selected'}`}
            type="number"
            min="1"
            max={currentProduct?.amountAvailable || 1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="form-control"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="buy-button"
          disabled={
            isSubmitting || 
            !currentProduct ||
            userDeposit < (currentProduct?.cost || 0) * quantity || 
            (currentProduct?.amountAvailable || 0) < quantity
          }
        >
          {isSubmitting ? 'Processing...' : 'Buy Now'}
        </Button>
      </form>
    </div>
  );
};

export default BuyForm;