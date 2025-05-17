"use client";

import { useEffect } from "react";
import { useProducts } from "@/context/ProductsContext";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "./ProductCard";
import "@/styles/ProductsList.css"; 

const ProductsList = ({ sellerOnly = false }) => {
  const {
    products,
    sellerProducts,
    loadingAll,
    loadingSeller,
    fetchAllProducts,
    fetchSellerProducts,
  } = useProducts();
  const { isSeller } = useAuth();

  useEffect(() => {
    // Refresh products when component mounts
    const fetchData = async () => {
      // console.log('ProductsList - Fetching products, sellerOnly:', sellerOnly);
      if (sellerOnly && isSeller) {
        await fetchSellerProducts();
      } else {
        await fetchAllProducts();
      }
    };
    
    fetchData();
  }, [sellerOnly, isSeller, fetchAllProducts, fetchSellerProducts]);


  // Determine which products to display
  const isLoading = sellerOnly ? loadingSeller : loadingAll;
  const rawProducts = sellerOnly ? sellerProducts : products;
  const displayProducts = Array.isArray(rawProducts) ? rawProducts : [];
  
  // console.log('ProductsList - Display products:', displayProducts?.length || 0);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (!displayProducts || displayProducts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📦</div>
        <h3 className="empty-state-text">
          {sellerOnly
            ? "You haven't added any products yet"
            : "No products available at the moment"}
        </h3>
        {sellerOnly && isSeller && (
          <a href="/products/add" className="empty-state-action">
            Add Your First Product
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="products-container">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;