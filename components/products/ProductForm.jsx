"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import "@/styles/ProductForm.css";

const ProductForm = ({ productId }) => {
  const router = useRouter();
  const { getProductById, addProduct, updateProduct } = useProducts();

  const [formData, setFormData] = useState({
    productName: "",
    cost: 0,
    amountAvailable: 0,
  });

  const [errors, setErrors] = useState({});
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // If productId is provided, fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        setInitialDataLoaded(true);
        return;
      }
  
      try {
        setIsLoadingProduct(true);
        const product = await getProductById(productId);
        if (product) {
          setFormData({
            productName: product.productName || '',
            cost: product.cost || 0,
            amountAvailable: product.amountAvailable || 0,
          });
        }
        setInitialDataLoaded(true);
      } catch (error) {
        console.error('Error fetching product:', error);
        showAlert('error', 'Failed to load product data');
      } finally {
        setIsLoadingProduct(false);
      }
    };
  
    fetchProductData();
  }, [productId, getProductById]);
  

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!formData.cost || formData.cost <= 0) {
      newErrors.cost = "Cost must be greater than 0";
    } else if (formData.cost % 5 !== 0) {
      newErrors.cost = "Cost must be a multiple of 5 cents";
    }

    if (!formData.amountAvailable || formData.amountAvailable <= 0) {
      newErrors.amountAvailable = "Amount must be greater than 0";
    } else if (!Number.isInteger(Number(formData.amountAvailable))) {
      newErrors.amountAvailable = "Amount must be a whole number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    // Convert numeric fields to numbers
    if (name === "cost" || name === "amountAvailable") {
      parsedValue = value === "" ? "" : Number(value);
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (productId) {
        // Update existing product
        await updateProduct(productId, formData);
        showAlert("success", "Product updated successfully");
      } else {
        // Create new product
        await addProduct(formData);
        showAlert("success", "Product created successfully");
        // Reset form after successful creation
        setFormData({
          productName: "",
          cost: 0,
          amountAvailable: 0,
        });
      }

      // Redirect to products page after a short delay
      setTimeout(() => {
        router.push("/products/manage");
      }, 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      showAlert("error", error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 5000);
  };

  if (isLoadingProduct && !initialDataLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false })}
        />
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className={errors.productName ? "error" : ""}
            disabled={isSubmitting}
          />
          {errors.productName && (
            <div className="error-message">{errors.productName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cost">Cost (in cents)</label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            min="5"
            step="5"
            className={errors.cost ? "error" : ""}
            disabled={isSubmitting}
          />
          {errors.cost && <div className="error-message">{errors.cost}</div>}
          <div className="help-text">Cost must be in multiples of 5 cents</div>
        </div>

        <div className="form-group">
          <label htmlFor="amountAvailable">Amount Available</label>
          <input
            type="number"
            id="amountAvailable"
            name="amountAvailable"
            value={formData.amountAvailable}
            onChange={handleChange}
            min="1"
            step="1"
            className={errors.amountAvailable ? "error" : ""}
            disabled={isSubmitting}
          />
          {errors.amountAvailable && (
            <div className="error-message">{errors.amountAvailable}</div>
          )}
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/products/manage")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : productId
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
