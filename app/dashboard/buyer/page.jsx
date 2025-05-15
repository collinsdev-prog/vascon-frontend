"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductsContext";
import { useVending } from "@/context/VendingContext";
import DepositForm from "@/components/buyer/DepositForm";
import BuyForm from "@/components/buyer/BuyForm";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import PurchaseResult from "@/components/buyer/purchaseResult";
import "@/styles/BuyerDashboard.css";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { products, fetchAllProducts } = useProducts();
  const {
    deposit,
    purchaseHistory,
    depositCoins,
    handleBuy,
    resetDeposit,
    fetchPurchaseHistory,
    isLoading,
    changeMessage,
    purchaseDetail,
  } = useVending();

  useEffect(() => {
    if (user?.role !== "buyer") {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    fetchAllProducts();
    fetchPurchaseHistory();
  }, [fetchAllProducts, fetchPurchaseHistory]);

  return (
    <div className="buyer-dashboard">
      {changeMessage && (
        <Alert type="info" className="change-message-alert">
          {changeMessage}
        </Alert>
      )}

{purchaseDetail && <PurchaseResult result={purchaseDetail} />}

      <h2 className="dashboard-title">Buyer Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <Card className="deposit-card">
            <h3 className="card-title">
              Available Deposit:{" "}
              <span className="deposit-amount">{deposit} cents</span>
            </h3>
            <DepositForm onDeposit={depositCoins} />
            <Button onClick={resetDeposit} className="reset-button">
              Reset Deposit
            </Button>
          </Card>

          <Card className="buy-card">
            <h3 className="card-title">Buy Product</h3>
            <BuyForm
              onBuy={handleBuy}
              products={products.map((product) => ({
                id: product.id,
                name: product.productName,
                cost: product.cost,
              }))}
            />
          </Card>
        </div>

        <div className="dashboard-column">
          <Card className="products-card">
            <h3 className="card-title">Available Products</h3>
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="product-preview">
                <h4 className="product-name">{product.productName}</h4>
                <p className="product-cost">Cost: {product.cost} cents</p>
                <div className="product-actions">
                  <input
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="product-quantity"
                    id={`quantity-${product.id}`}
                  />
                  <Button
                    onClick={() => {
                      const quantity = parseInt(
                        document.getElementById(`quantity-${product.id}`)
                          ?.value || "1"
                      );
                      handleBuy(product.id, quantity);
                    }}
                    className="buy-now-button"
                  >
                    Buy
                  </Button>
                </div>
              </div>
            ))}
            <Button
              onClick={() => router.push("/dashboard/buyer/buy")}
              className="view-more-button"
            >
              View More Products
            </Button>
          </Card>
        </div>
      </div>

      <Card className="history-card">
        <h3 className="card-title">Complete Purchase History</h3>
        {isLoading ? (
          <div className="loading-indicator">Loading purchase history...</div>
        ) : purchaseHistory.length > 0 ? (
          <div className="purchase-history">
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory?.map((item) => {
                    const unitPrice = (
                      parseFloat(item.totalPrice) / item.quantity
                    ).toFixed(2);
                    return (
                      <tr key={item.saleId}>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>{unitPrice} cents</td>
                        <td>{item.totalPrice} cents</td>
                        <td>
                          <span className="status-completed">Completed</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="empty-history">No purchase history available.</p>
        )}
      </Card>
    </div>
  );
};

export default BuyerDashboard;
