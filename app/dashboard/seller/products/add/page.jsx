'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProductForm from '@/components/products/ProductForm';
import '@/styles/Products.css';

const AddProductPage = () => {
  const { isAuthenticated, isSeller, loading } = useAuth();
  const router = useRouter();
  
  // Redirect if user is not a seller
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isSeller)) {
      router.push('/products');
    }
  }, [isAuthenticated, isSeller, loading, router]);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated || !isSeller) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add New Product</h1>
        <a href="/products/manage" className="back-link">
          Back to My Products
        </a>
      </div>
      
      <ProductForm />
    </div>
  );
};

export default AddProductPage;