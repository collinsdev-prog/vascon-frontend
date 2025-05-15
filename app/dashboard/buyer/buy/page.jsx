"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useVending } from "@/context/VendingContext";
import { useProducts } from "@/context/ProductsContext";
import { toast } from "sonner";
import PurchaseResult from "@/components/buyer/purchaseResult";
import "@/styles/BuyPage.css";


const BuyPage = () => {
  const { user } = useAuth();
  const { products, loadingAll, fetchAllProducts } = useProducts();
  const { deposit, handleBuy, isLoading, purchaseDetail } = useVending();

  // Initially load products
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Handling purchase logic
  const handlePurchase = async (productId, quantity) => {
    if (deposit <= 0) {
      toast.error("Insufficient funds");
      return null;
    }

    const parsedProductId = parseInt(productId, 10);
    const parsedQuantity = parseInt(quantity, 10);

    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      toast.error("Invalid product");
      return null;
    }
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      toast.error("Invalid quantity");
      return null;
    }

    try {
      return await handleBuy(parsedProductId, parsedQuantity);
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to complete purchase");
      return null;
    }
  };

  if (loadingAll) return <div className="loading-state">Loading products...</div>;
  if (isLoading) return <div className="loading-state">Processing your transaction...</div>;

  return (
    <div className="buy-page">
      <div className="buy-page-header">
        <h1 className="buy-page-title">Buy Products</h1>
        <div className="deposit-display">
          Current Deposit: <span className="deposit-amount">{deposit} cents</span>
        </div>
      </div>

      {/* Display purchase result if available */}
      {purchaseDetail && <PurchaseResult result={purchaseDetail} />}

      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-card-header">
              <h3 className="product-name">{product.productName}</h3>
            </div>
            <div className="product-card-body">
              <p className="product-cost">Cost: {product.cost} cents</p>
              <p className="product-seller">Seller: {product.sellerName || product.sellerId || "Unknown"}</p>
              <p className="product-availability">
                Available: <span className={product.amountAvailable > 0 ? "in-stock" : "out-of-stock"}>
                  {product.amountAvailable}
                </span>
              </p>
              
              {/* I Integrated buy form directly instead of using separate component */}
              {product.amountAvailable > 0 ? (
                <div className="buy-form">
                  <div className="quantity-field">
                    <label htmlFor={`quantity-${product.id}`}>Quantity</label>
                    <input
                      type="number"
                      id={`quantity-${product.id}`}
                      min="1"
                      max={product.amountAvailable}
                      defaultValue="1"
                      className="quantity-input"
                    />
                  </div>
                  <button
                    className="buy-button"
                    disabled={deposit <= 0}
                    onClick={() => {
                      const quantity = document.getElementById(`quantity-${product.id}`).value;
                      handlePurchase(product.id, quantity);
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              ) : (
                <div className="out-of-stock-message">Out of Stock</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyPage;