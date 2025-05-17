"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductsContext';
import { useVending } from '@/context/VendingContext';
import { toast } from 'react-hot-toast';
import { formatCentsToDollars } from '@/utils/currency';

const ProductCard = ({ product }) => {
  const { isAuthenticated, isSeller, isBuyer } = useAuth();
  const { deleteProduct, isSellerProduct } = useProducts();
  const { handleBuy, deposit } = useVending();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Calculate if user can afford this product
  const totalCost = product.cost * quantity;
  const canAfford = deposit >= totalCost;
  const isAvailable = product.amountAvailable >= quantity;
  
  // Confirmed delete handler
  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteProduct(product.id);
      toast.success('Product deleted successfully');
      setShowDeleteDialog(false);
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
  
  const isOwner = isSeller && isSellerProduct(product.id);
  
  return (
    <>
      <div className="product-card">
        <div className="product-image">
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
                  onClick={() => setShowDeleteDialog(true)}
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
      
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete <strong>{product.productName}</strong>?</p>
            <div className="dialog-actions">
              <button 
                className="cancel-button" 
                onClick={() => setShowDeleteDialog(false)} 
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-button" 
                onClick={confirmDelete} 
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          <style jsx>{`
            .dialog-overlay {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
            }
            .dialog {
              background: var(--color-bg, #fff);
              padding: 1.5rem 2rem;
              border-radius: 8px;
              box-shadow: 0 0 15px rgba(0,0,0,0.3);
              max-width: 320px;
              width: 100%;
              text-align: center;
              color: var(--color-text, #222);
            }
            .dialog-actions {
              margin-top: 1.5rem;
              display: flex;
              justify-content: space-between;
            }
            .cancel-button, .confirm-delete-button {
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-weight: 600;
              min-width: 100px;
            }
            .cancel-button {
              background: var(--color-secondary, #ccc);
              color: var(--color-text, #222);
            }
            .cancel-button:hover:not(:disabled) {
              background: var(--color-secondary-hover, #bbb);
            }
            .confirm-delete-button {
              background: var(--color-error, #e63946);
              color: white;
            }
            .confirm-delete-button:hover:not(:disabled) {
              background: var(--color-error-hover, #d62828);
            }
            .cancel-button:disabled,
            .confirm-delete-button:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default ProductCard;
