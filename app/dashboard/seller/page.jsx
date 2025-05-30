'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductsContext';
import { useVending } from '@/context/VendingContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import '@/styles/Dashboard.css';

const SellerDashboard = () => {
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { user } = useAuth();
  const router = useRouter();

  // Use ProductsContext
  const { 
    sellerProducts, 
    loading: productsLoading, 
    fetchSellerProducts, 
    deleteProduct 
  } = useProducts();

  // Use VendingContext
  const { 
    salesStats, 
    fetchSalesStats, 
    isLoading: vendingLoading 
  } = useVending();

  useEffect(() => {
    // Redirect if not logged in or not a seller
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user && user.role !== 'seller') {
      router.push('/');
      return;
    }

    // Fetch seller's products and stats
    fetchSellerProducts();
    fetchSalesStats();
  }, [user, router, fetchSellerProducts, fetchSalesStats]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await deleteProduct(productToDelete.id);
      showAlert('success', 'Product deleted successfully');
      setShowDeleteDialog(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      showAlert('error', error.message || 'Failed to delete product');
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (productId) => {
    router.push(`/products/edit/${productId}`);
  };

  return (
    <div className="dashboard seller-dashboard">
      <h1>Seller Dashboard</h1>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />
      )}

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <Card title="Seller Stats">
            {vendingLoading ? (
              <p>Loading stats...</p>
            ) : (
              <div className="seller-stats">
                <div className="stat-item">
                  <h3>Total Products</h3>
                  <p className="stat-value">{sellerProducts.length}</p>
                </div>
                <div className="stat-item">
                  <h3>Total Sold</h3>
                  <p className="stat-value">{salesStats?.totalProductsSold || 0}</p>
                </div>
                <div className="stat-item">
                  <h3>Revenue</h3>
                  <p className="stat-value">{salesStats?.totalRevenue || 0} cents</p>
                </div>
              </div>
            )}
          </Card>

          <Card title="Quick Actions">
            <div className="quick-actions">
              <Link href="seller/products/add">
                <Button variant="primary" className="full-width">Add New Product</Button>
              </Link>
              <Link href="/products">
                <Button variant="secondary" className="full-width">View All Products</Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="dashboard-section large">
          <Card title="My Products">
            {productsLoading ? (
              <p>Loading products...</p>
            ) : sellerProducts.length > 0 ? (
              <div className="product-management-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Available</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerProducts.map(product => (
                      <tr key={product.id}>
                        <td>{product.productName}</td>
                        <td>{product.cost} cents</td>
                        <td>{product.amountAvailable}</td>
                        <td className="action-buttons">
                          <Button 
                            variant="secondary" 
                            size="small" 
                            onClick={() => handleEditProduct(product.id)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="danger" 
                            size="small" 
                            onClick={() => handleDeleteClick(product)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't added any products yet.</p>
                <Link href="/dashboard/seller/products/add">
                  <Button variant="primary">Add Your First Product</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete the product <strong>{productToDelete?.productName}</strong>?</p>
            <div className="modal-actions">
              <Button variant="danger" onClick={confirmDeleteProduct}>Yes, Delete</Button>
              <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .modal {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          text-align: center;
        }
        .modal-actions {
          margin-top: 1.5rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};

export default SellerDashboard;
