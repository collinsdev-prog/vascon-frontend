'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductsList from '@/components/products/ProductList';
import '@/styles/Products.css';

const ManageProductsPage = () => {
  const { user, isAuthenticated, isSeller, loading } = useAuth();
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
        <h1>Manage Your Products</h1>
        <Link href="/dashboard/seller/products/add" className="add-product-button">
          Add New Product
        </Link>
      </div>
      
      <ProductsList sellerOnly={true} />
    </div>
  );
};

export default ManageProductsPage;
