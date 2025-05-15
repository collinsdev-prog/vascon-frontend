'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useVending } from '@/context/VendingContext';
import '@/styles/BuyerDepositPage.css';
import DepositForm from '@/components/buyer/DepositForm';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';

const BuyerDepositPage = () => {
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const { user } = useAuth();
  const { depositCoins, resetDeposit, deposit } = useVending();
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
  }, [user, router]);

  const handleDeposit = async (amount) => {
    try {
      await depositCoins(amount);
      showAlert('success', `Successfully deposited ${amount} cents`);
    } catch (error) {
      console.error('Error making deposit:', error);
      showAlert('error', error.message || 'Failed to deposit');
    }
  };

  const handleReset = async () => {
    try {
      await resetDeposit();
      showAlert('success', 'Deposit reset successfully');
    } catch (error) {
      console.error('Error resetting deposit:', error);
      showAlert('error', error.message || 'Failed to reset deposit');
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  // Get the current balance to display - use user.deposit as authoritative 
  // with fallback to userDeposit from VendingContext
  const currentBalance = deposit;

  return (
    <div className="dashboard buyer-deposit">
      <h1>Deposit Funds</h1>
      
      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />
      )}
      
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <Card title="Your Account">
            <div className="account-info">
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Current Balance:</strong> {currentBalance} cents</p>
              <div className="action-buttons">
                <Button onClick={handleReset} variant="secondary">Reset Deposit</Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="dashboard-section">
          <Card title="Deposit Coins">
            <p className="deposit-instructions">
              Please insert coins in the denominations of 5, 10, 20, 50, or 100 cents.
            </p>
            <DepositForm onDeposit={handleDeposit} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuyerDepositPage;