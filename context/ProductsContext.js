"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useApiWithLoader } from "@/lib/makeApiRequestWithLoader";
import { useAuth } from "@/context/AuthContext";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const api = useApiWithLoader();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingSeller, setLoadingSeller] = useState(false);

  // Extract products array from potentially nested API response
  const extractProductsArray = (response) => {
    // console.log("Extracting products from response:", response);

    if (Array.isArray(response)) {
      return response;
    }

    if (response && Array.isArray(response.data)) {
      return response.data;
    }

    if (response && response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    console.warn("Unexpected API response format:", response);
    return [];
  };

  const fetchAllProducts = useCallback(async () => {
    setLoadingAll(true); 
    try {
      const response = await api("/products", "GET");
      console.log("ProductsContext - Fetched all products response:", response);
  
      const productsArray = extractProductsArray(response);
      // console.log("Extracted products array:", productsArray);
  
      setProducts(productsArray);
      return productsArray;
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      return [];
    } finally {
      setLoadingAll(false);
    }
  }, [api]);
  
  const fetchSellerProducts = useCallback(async () => {
    if (!user || user.role !== "seller") return;
  
    setLoadingSeller(true); // Corrected
    try {
      const response = await api("/products/my-products", "GET");
      // console.log("ProductsContext - Fetched seller products:", response);
  
      const productsArray = extractProductsArray(response);
      // console.log("Extracted seller products array:", productsArray);
  
      setSellerProducts(productsArray);
      return productsArray;
    } catch (error) {
      console.error("Error fetching seller products:", error);
      setSellerProducts([]);
      return [];
    } finally {
      setLoadingSeller(false); 
    }
  }, [api, user]);
  

  // Fetch all products initially
  useEffect(() => {
    // console.log("Initializing products fetch");
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Fetch seller's products when user changes
  useEffect(() => {
    if (user?.role === "seller") {
      fetchSellerProducts();
    } else {
      setSellerProducts([]);
    }
  }, [user, fetchSellerProducts]);

  const getProductById = async (productId) => {
    const cached =
      products.find((p) => p.id === productId) ||
      sellerProducts.find((p) => p.id === productId);
    if (cached) return cached;
    try {
      const response = await api(`/products/${productId}`, "GET");
      // Extract the product object if needed
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  };

  const addProduct = async (productData) => {
    try {
      const response = await api("/products", "POST", productData);
      console.log("ProductsContext - Added product:", response);

      // Update products lists
      await fetchAllProducts();
      if (user?.role === "seller") {
        await fetchSellerProducts();
      }

      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const response = await api(`/products/${productId}`, "PUT", productData);
      console.log("ProductsContext - Updated product:", response);

      // Update products lists
      await fetchAllProducts();
      if (user?.role === "seller") {
        await fetchSellerProducts();
      }

      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await api(`/products/${productId}`, "DELETE");
      console.log("ProductsContext - Deleted product:", productId);

      // Update products lists after deletion
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      setSellerProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );

      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        sellerProducts,
        loadingAll,
        loadingSeller,
        fetchAllProducts,
        fetchSellerProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        isSellerProduct: (productId) =>
          sellerProducts.some((p) => p.id.toString() === productId.toString()),
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
