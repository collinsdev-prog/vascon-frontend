"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useVending } from "@/context/VendingContext";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import { toast } from "react-hot-toast";
import { formatCentsToDollars } from "@/utils/currency";
import "@/styles/buyer-history.css";

const BuyerHistoryPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { purchaseHistory, fetchPurchaseHistory } = useVending();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "buyer") {
      router.push("/");
      return;
    }

    const loadHistory = async () => {
      setIsLoading(true);
      try {
        await fetchPurchaseHistory();
        toast.success("Purchase history loaded successfully");
      } catch (error) {
        toast.error(error?.message || "Failed to load purchase history");
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [isAuthenticated, user, router, fetchPurchaseHistory]);

  useEffect(() => {
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
  }, [fetchPurchaseHistory]);

  return (
    <div className="dashboard buyer-history">
      {/* <h1>Purchase History</h1> */}

      <Card title="Complete Purchase History">
        {isLoading ? (
          <div className="loading">Loading purchase history...</div>
        ) : purchaseHistory && purchaseHistory.length > 0 ? (
          <div className="purchase-history">
            <div className="table-responsive">
              <table>
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
                  {purchaseHistory.map((item) => {
                    // Calculate unit price in cents and format as dollars
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
          <p>No purchase history available.</p>
        )}
      </Card>
    </div>
  );
};

export default BuyerHistoryPage;
