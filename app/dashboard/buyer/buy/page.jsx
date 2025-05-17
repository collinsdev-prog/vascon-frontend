"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useVending } from "@/context/VendingContext";
import { useProducts } from "@/context/ProductsContext";
import { toast } from "sonner";
import PurchaseResult from "@/components/buyer/purchaseResult";
import { formatCentsToDollars } from "@/utils/currency";
import "@/styles/BuyPage.css";

const BuyPage = () => {
  const { user } = useAuth();
  const { products, loadingAll, fetchAllProducts } = useProducts();
  const { deposit, handleBuy, isLoading, purchaseDetail } = useVending();

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleQuantityChange = (productId, value) => {
    const quantity = parseInt(value, 10);
    setQuantities((prev) => ({
      ...prev,
      [productId]: isNaN(quantity) || quantity <= 0 ? 1 : quantity,
    }));
  };

  const handlePurchase = async (productId) => {
    const quantity = quantities[productId] || 1;

    if (deposit <= 0) {
      toast.error("Insufficient funds");
      return null;
    }

    const parsedProductId = parseInt(productId, 10);
    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      toast.error("Invalid product");
      return null;
    }

    try {
      return await handleBuy(parsedProductId, quantity);
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to complete purchase");
      return null;
    }
  };

  if (loadingAll)
    return <div className="loading-state">Loading products...</div>;
  if (isLoading)
    return <div className="loading-state">Processing your transaction...</div>;

  return (
    <div className="buy-page">
      <div className="buy-page-header">
        <h1 className="buy-page-title">Buy Products</h1>
        <div className="deposit-display">
          Current Deposit:{" "}
          <span className="deposit-amount">
            {formatCentsToDollars(deposit)}
          </span>
        </div>
      </div>

      {purchaseDetail && <PurchaseResult result={purchaseDetail} />}

      <div className="products-grid">
        {products.map((product) => {
          const quantity = quantities[product.id] || 1;
          const totalCost = product.cost * quantity;

          return (
            <div className="product-card" key={product.id}>
              <div className="product-card-header">
                <h3 className="product-name">{product.productName}</h3>
              </div>
              <div className="product-card-body">
                <p className="product-cost">
                  Unit Cost: {formatCentsToDollars(product.cost)}
                </p>
                <p className="product-seller">
                  Owner: {product.sellerName || product.sellerId || "Unknown"}
                </p>
                <p className="product-availability">
                  Available:{" "}
                  <span
                    className={
                      product.amountAvailable > 0 ? "in-stock" : "out-of-stock"
                    }
                  >
                    {product.amountAvailable}
                  </span>
                </p>

                {product.amountAvailable > 0 ? (
                  <div className="buy-form">
                    <div className="quantity-field">
                      <label htmlFor={`quantity-${product.id}`}>Quantity</label>
                      <input
                        type="number"
                        id={`quantity-${product.id}`}
                        min="1"
                        max={product.amountAvailable}
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(product.id, e.target.value)
                        }
                        className="quantity-input"
                      />
                    </div>
                    <div className="total-cost">
                      Total: {formatCentsToDollars(totalCost)}
                    </div>
                    <button
                      className="buy-button"
                      disabled={deposit < totalCost}
                      onClick={() => handlePurchase(product.id)}
                    >
                      Buy Now
                    </button>
                  </div>
                ) : (
                  <div className="out-of-stock-message">Out of Stock</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BuyPage;
