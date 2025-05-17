"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductsContext';
import { useVending } from '@/context/VendingContext';
import { toast } from 'react-hot-toast';
import { formatCentsToDollars } from '@/utils/currency';

const ProductCard = ({ product }) => {
  const { user, isAuthenticated, isSeller, isBuyer } = useAuth();
  const { deleteProduct, isSellerProduct } = useProducts();
  const { handleBuy, deposit } = useVending();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate if user can afford this product
  const totalCost = product.cost * quantity;
  const canAfford = deposit >= totalCost;
  const isAvailable = product.amountAvailable >= quantity;
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setIsLoading(true);
    try {
      await deleteProduct(product.id);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePurchase = async () => {
    if (!isAuthenticated || !isBuyer) {
      toast.error('You must be logged in as a buyer to make purchases');
      return;
    }
    
    if (!canAfford) {
      toast.error('Insufficient funds. Please deposit more coins.');
      return;
    }
    
    if (!isAvailable) {
      toast.error('Not enough items in stock');
      return;
    }
    
    setIsLoading(true);
    try {
      await handleBuy(product.id, quantity);
      // Note: We don't need to handle toast notifications here
      // The purchase result will be displayed via the PurchaseResult component
      // that we added to the ProductsPage
      
      // Reset quantity after purchase
      setQuantity(1);
    } catch (error) {
      toast.error(error.message || 'Purchase failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < product.amountAvailable) {
      setQuantity(q => q + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };
  
  // Check if the current user is the seller of this product
  const isOwner = isSeller && isSellerProduct(product.id);
  
  return (
    <div className="product-card">
      <div className="product-image">
        {/* This is supposed to be be the product image */}
        <div style={{ fontSize: '2rem' }}>🛒</div>
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{product.productName}</h3>
        <div className="product-price">{formatCentsToDollars(product.cost)}</div>
        <div className="product-availability">
          Available: {product.amountAvailable} items
        </div>
        {!isOwner && isBuyer && isAuthenticated && (
          <div className="quantity-controls">
            <button 
              type="button" 
              className="quantity-button" 
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isLoading}
            >
              -
            </button>
            <input 
              type="number" 
              className="quantity-input" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.min(product.amountAvailable, Math.max(1, parseInt(e.target.value) || 1)))}
              min="1"
              max={product.amountAvailable}
              disabled={isLoading}
            />
            <button 
              type="button" 
              className="quantity-button" 
              onClick={incrementQuantity}
              disabled={quantity >= product.amountAvailable || isLoading}
            >
              +
            </button>
          </div>
        )}
        
        <div className="product-actions">
          {isOwner ? (
            <div className="seller-actions">
              <a href={`/products/edit/${product.id}`} className="edit-button">
                Edit
              </a>
              <button 
                className="delete-button" 
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ) : isBuyer && isAuthenticated ? (
            <button 
              className="buy-button" 
              onClick={handlePurchase}
              disabled={!canAfford || !isAvailable || isLoading}
            >
              {isLoading ? 'Processing...' : `Buy Now (${formatCentsToDollars(totalCost)})`}
            </button>
          ) : (
            <button 
              className="buy-button" 
              disabled
              title={!isAuthenticated ? 'Login as buyer to purchase' : 'Only buyers can make purchases'}
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;