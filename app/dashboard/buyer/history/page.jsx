'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useVending } from '@/context/VendingContext';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';

const BuyerHistoryPage = () => {
  const { user } = useAuth();
  const { purchaseHistory, fetchPurchaseHistory } = useVending();
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user && user.role !== 'buyer') {
      router.push('/');
      return;
    }

    const loadHistory = async () => {
      setIsLoading(true);
      try {
        await fetchPurchaseHistory();
      } catch (error) {
        showAlert('error', 'Failed to load purchase history');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [user, router, fetchPurchaseHistory]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  return (
    <div className="dashboard buyer-history">
      <h1>Purchase History</h1>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />
      )}

      <Card title="Complete Purchase History">
        {isLoading ? (
          <div className="loading">Loading purchase history...</div>
        ) : purchaseHistory.length > 0 ? (
          <div className="purchase-history">
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
  {purchaseHistory?.map((item) => {
    const unitPrice = (parseFloat(item.totalPrice) / item.quantity).toFixed(2);
    return (
      <tr key={item.saleId}>
        <td>{new Date(item.date).toLocaleDateString()}</td>
        <td>{item.productName}</td>
        <td>{item.quantity}</td>
        <td>{unitPrice} cents</td>
        <td>{item.totalPrice} cents</td>
        <td>Completed</td>
      </tr>
    );
  })}
</tbody>


            </table>
          </div>
        ) : (
          <p>No purchase history available.</p>
        )}
      </Card>
    </div>
  );
};

export default BuyerHistoryPage;
