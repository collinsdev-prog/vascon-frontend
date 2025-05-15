'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApiWithLoader } from '@/lib/makeApiRequestWithLoader';
import { useAuth } from '@/context/AuthContext';
import toast from "react-hot-toast";

const VendingContext = createContext();

export const VendingProvider = ({ children }) => {
  const api = useApiWithLoader();
  const [deposit, setDeposit] = useState(0);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [salesStats, setSalesStats] = useState(null);
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [changeMessage, setChangeMessage] = useState('');
  const [purchaseDetail, setPurchaseDetail] = useState(null);


  // This useEffect ensures users deposit state is always synced with user data
  useEffect(() => {
    if (user?.deposit !== undefined) {
      setDeposit(user.deposit);
    }
  }, [user?.deposit]);

  const fetchPurchaseHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api('/user/my-purchase-history', 'GET');
      // console.log('VendingContext - Purchase History Response:', res.data); // Debugging line
      setPurchaseHistory(res.data);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch purchase history:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [api]);
  
  const fetchSalesStats = useCallback(async () => {
    try {
      const res = await api('/sales/stats', 'GET');
      console.log('✅ Sales Stats Response:', res); // Inspect structure
      setSalesStats(res.data);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch sales stats:', error);
      throw error;
    }
  }, [api]);

  // Load purchase history for buyers
  useEffect(() => {
    if (user?.role === 'buyer') {
      fetchPurchaseHistory();
    }
  }, [user?.role, fetchPurchaseHistory]);
  
  // Load sales stats for sellers
  useEffect(() => {
    if (user?.role === 'seller') {
      fetchSalesStats();
    }
  }, [user?.role, fetchSalesStats]);

  // Effect to refresh purchase history after successful purchase
  useEffect(() => {
    if (purchaseCompleted && user?.role === 'buyer') {
      fetchPurchaseHistory();
      setPurchaseCompleted(false);
    }
  }, [purchaseCompleted, user?.role, fetchPurchaseHistory]);

  const depositCoins = useCallback(async (amount) => {
    try {
      const res = await api('/user/deposit', 'POST', { amount });
      const newDeposit = res.data.currentDeposit;
  
      // Update local deposit state
      setDeposit(newDeposit);
  
      // Sync with AuthContext
      updateUser({ deposit: newDeposit });
  
      // ✅ Trigger global toast
      toast.success(`Successfully deposited ${amount} cents`);
  
      return res.data;
    } catch (error) {
      console.error('Deposit error:', error);
  
      // ✅ Trigger error toast
      toast.error(error.message || 'Failed to deposit');
      
      throw error;
    }
  }, [api, updateUser]);
  
  // Handle purchase logic
  const handleBuy = useCallback(async (productId, quantity, productPrice) => {
    const totalCost = productPrice * quantity;

    if (deposit < totalCost) {
      setChangeMessage('Insufficient funds. Please deposit to make a purchase.');
      return;
    }
    try {
      const res = await api('/user/buy', 'POST', { productId, quantity });
      
      // Process the new API response format
      if (res?.data) {
        const { change, note, products, depositedAmount, totalSpent } = res.data;
        
        // Reset deposit to 0 after each purchase
        setDeposit(0);
        updateUser({ deposit: 0 });
        
        
        // Generate change message
        setChangeMessage(
          change?.length
            ? `✅ Purchase successful. Your change: ${change.map(c => `${c} cents`).join(', ')}`
            : '✅ Purchase successful. No change returned.'
        );
        
        // Set purchase details for display
        setPurchaseDetail({
          depositedAmount,
          totalSpent,
          products,
          note
        });
        
        // Signal that a purchase was completed to trigger history refresh
        setPurchaseCompleted(true);
      }
      
      return res.data;
    } catch (error) {
      console.error('Buy error:', error);
      throw error;
    }
  }, [api, deposit, updateUser]);

  const resetDeposit = useCallback(async () => {
    try {
      const res = await api('/user/reset', 'POST');
      // Update both states
      setDeposit(0);
      updateUser({ deposit: 0 }); // Sync with AuthContext
      return res.data;
    } catch (error) {
      console.error('Reset deposit error:', error);
      throw error;
    }
  }, [api, updateUser]);

  const clearPurchaseResult = () => {
    setPurchaseDetail(null);
    setChangeMessage(null);
  };
  

  return (
    <VendingContext.Provider value={{ 
      deposit, 
      depositCoins, 
      handleBuy, 
      resetDeposit,
      changeMessage,
      // Add userDeposit to directly access the current user deposit value
      userDeposit: user?.deposit ?? deposit,
      purchaseHistory,
      salesStats,
      fetchPurchaseHistory,
      fetchSalesStats,
      isLoading,
      purchaseDetail,
      changeMessage,
      clearPurchaseResult,
    }}>
      {children}
    </VendingContext.Provider>
  );
};

export const useVending = () => useContext(VendingContext);