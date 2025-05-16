'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductsContext';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import '../styles/Products.css';

const EditProductPage = () => {
  const { isAuthenticated, isSeller, loading: authLoading } = useAuth();
  const { getProductById, isSellerProduct } = useProducts();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  
  // Check if current user is the owner of this product
  useEffect(() => {
    const checkProductOwnership = async () => {
      if (!productId || !isAuthenticated || !isSeller) {
        setLoading(false);
        return;
      }
      
      try {
        // Check if the product exists and belongs to the current seller
        await getProductById(productId);
        const ownerStatus = isSellerProduct(productId);
        setIsOwner(ownerStatus);
      } catch (error) {
        console.error('Error checking product ownership:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      checkProductOwnership();
    }
  }, [productId, isAuthenticated, isSeller, getProductById, isSellerProduct, authLoading]);
  
  // Redirect if not authenticated, not a seller, or not the owner
  useEffect(() => {
    if (!loading && !authLoading && (!isAuthenticated || !isSeller || !isOwner)) {
      router.push('/products');
    }
  }, [isAuthenticated, isSeller, isOwner, loading, authLoading, router]);
  
  if (loading || authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated || !isSeller || !isOwner) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Edit Product</h1>
        <a href="/products/manage" className="back-link">
          Back to My Products
        </a>
      </div>
      
      <ProductForm productId={productId} />
    </div>
  );
};

export default EditProductPage;