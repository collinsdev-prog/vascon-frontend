"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductsContext";
import { useVending } from "@/context/VendingContext";
import DepositForm from "@/components/buyer/DepositForm";
// import BuyForm from "@/components/buyer/BuyForm";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import { formatCentsToDollars } from "@/utils/currency";
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
    // Check if table is scrollable and add appropriate class
    const checkTableOverflow = () => {
      const tableWrappers = document.querySelectorAll(".table-responsive");
      tableWrappers.forEach((wrapper) => {
        if (wrapper.scrollWidth > wrapper.clientWidth) {
          wrapper.classList.add("has-overflow");
        } else {
          wrapper.classList.remove("has-overflow");
        }
      });
    };

    // Initial check
    setTimeout(checkTableOverflow, 100);

    // Set up resize observer to check when window size changes
    const resizeObserver = new ResizeObserver(checkTableOverflow);
    const tableWrapper = document.querySelector(".table-responsive");
    if (tableWrapper) {
      resizeObserver.observe(tableWrapper);
    }

    return () => {
      if (tableWrapper) {
        resizeObserver.unobserve(tableWrapper);
      }
    };
  }, [fetchAllProducts, fetchPurchaseHistory]);
  
  return (
    <div className="buyer-dashboard">
      {changeMessage && (
        <Alert type="info" className="change-message-alert">
          {changeMessage}
        </Alert>
      )}
      {purchaseDetail && <PurchaseResult result={purchaseDetail} />}

      <h3 className="dashboard-title">Dashboard</h3>

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <Card className="deposit-card">
            <h3 className="card-title">
              Available Deposit:{" "}
              <span className="deposit-amount">
                {formatCentsToDollars(deposit)}
              </span>
            </h3>
            <DepositForm onDeposit={depositCoins} />
            <Button onClick={resetDeposit} className="reset-button">
              Reset Deposit
            </Button>
          </Card>

          {/* <Card className="buy-card">
        <h3 className="card-title">Buy Product</h3>
        <BuyForm
          onBuy={handleBuy}
          products={products.map((product) => ({
            id: product.id,
            name: product.productName,
            cost: product.cost,
          }))}
        />
      </Card> */}
        </div>

        <div className="dashboard-column">
          <Card className="products-card">
            <h3 className="card-title">Available Products</h3>
            <div className="products-grid">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="product-preview">
                  <h4 className="product-name">{product.productName}</h4>
                  <p className="product-cost">
                    Cost: {formatCentsToDollars(product.cost)}
                  </p>
                  <div className="product-actions">
                    <input
                      type="number"
                      min={1}
                      defaultValue={1}
                      className="product-quantity"
                      id={`quantity-${product.id}`}
                      aria-label="Quantity"
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
            </div>
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
                    const unitPriceCents = Math.round(
                      parseFloat(item.totalPrice) / item.quantity
                    );
                    return (
                      <tr key={item.saleId}>
                        <td data-label="Date">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td data-label="Product">{item.productName}</td>
                        <td data-label="Quantity">{item.quantity}</td>
                        <td data-label="Unit Price">
                          {formatCentsToDollars(unitPriceCents)}
                        </td>
                        <td data-label="Total Price">
                          {formatCentsToDollars(
                            Math.round(parseFloat(item.totalPrice))
                          )}
                        </td>
                        <td data-label="Status">
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
