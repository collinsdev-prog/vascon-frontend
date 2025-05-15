'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductsContext';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import '@/styles/Products.css';

const EditProductPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { getProductById, isSellerProduct } = useProducts();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id ?? "";

  const [loading, setLoading] = useState(true);
  const [productExists, setProductExists] = useState(false);
  const [isOwner, setIsOwner] = useState(null);
  const [ownershipChecked, setOwnershipChecked] = useState(false);


  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const product = await getProductById(productId);
        setProductExists(!!product);
  
        if (product && user) {
          const ownership = isSellerProduct(productId);
          setIsOwner(ownership);
        } else {
          setIsOwner(false); // explicitly say user is not owner
        }
      } catch (err) {
        console.error('Product fetch failed:', err);
        setProductExists(false);
        setIsOwner(false); // safe fallback
      } finally {
        // setOwnershipChecked(true);
        setLoading(false);
      }
    };
  
    if (!authLoading && user && productId) {
      fetchProductData();
    }
  }, [authLoading, user, productId, getProductById, isSellerProduct]);
  

  useEffect(() => {
    if (loading || authLoading || !ownershipChecked) return;
  
    if (!user) {
      router.replace('/auth/login');
    } else if (user.role !== 'seller') {
      router.replace('/products');
    } else if (!productExists) {
      router.replace('/products/manage');
    } else if (!isOwner) {
      router.replace('/products'); // no premature redirect
    }
  }, [user, loading, authLoading, ownershipChecked, productExists, isOwner, router]);
  

  if (loading || authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Edit Product</h1>
        <button 
          onClick={() => router.push('/products/manage')} 
          className="back-link"
        >
          Back to My Products
        </button>
      </div>

      <ProductForm productId={productId} />
    </div>
  );
};

export default EditProductPage;
