// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import ProductList from '@/components/products/ProductList';
// import BuyForm from '@/components/buyer/BuyForm';
// import Card from '@/components/ui/Card';
// import Alert from '@/components/ui/Alert';
// import { makeApiRequest } from '@/lib/apiClient';

// const BuyerProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [alert, setAlert] = useState({ show: false, type: '', message: '' });
//   const { user, updateUser } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) {
//       router.push('/auth/login');
//       return;
//     }

//     if (user && user.role !== 'buyer') {
//       router.push('/');
//       return;
//     }

//     fetchProducts();
//   }, [user, router]);

//   const fetchProducts = async () => {
//     try {
//       const res = await makeApiRequest('/products', 'GET');
//       setProducts(res.data);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       showAlert('error', 'Failed to load products');
//     }
//   };

//   const handleProductSelect = (product) => {
//     setSelectedProduct(product);
//   };

//   const handleBuy = async (productId, amount) => {
//     try {
//       const res = await makeApiRequest('/buy', 'POST', { productId, amount });
//       updateUser({ deposit: res.data.remainingDeposit || 0 });
//       fetchProducts();

//       let changeMessage = '';
//       if (res.data.change && res.data.change.length > 0) {
//         const changeDetails = res.data.change.map(coin => `${coin} cents`).join(', ');
//         changeMessage = ` Your change: ${changeDetails}`;
//       }

//       showAlert('success', `Successfully purchased ${amount} ${res.data.productName}.${changeMessage}`);
//       setSelectedProduct(null);
//     } catch (error) {
//       console.error('Error making purchase:', error);
//       showAlert('error', error.message || 'Failed to complete purchase');
//     }
//   };

//   const showAlert = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => {
//       setAlert({ show: false, type: '', message: '' });
//     }, 5000);
//   };

//   return (
//     <div className="dashboard buyer-products">
//       <h1>Available Products</h1>
      
//       {alert.show && (
//         <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />
//       )}
      
//       <div className="dashboard-grid">
//         <div className="dashboard-section">
//           <Card title="Products">
//             <ProductList 
//               products={products} 
//               onSelectProduct={handleProductSelect} 
//               selectedProductId={selectedProduct?.id} 
//             />
//           </Card>
//         </div>
        
//         <div className="dashboard-section">
//           {selectedProduct && (
//             <Card title="Buy Product">
//               <BuyForm 
//                 product={selectedProduct} 
//                 userDeposit={user?.deposit || 0} 
//                 onBuy={handleBuy} 
//               />
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BuyerProductsPage;