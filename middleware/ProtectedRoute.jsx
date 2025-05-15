// // middleware/ProtectedRoute.jsx
// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading) {
//       if (!user) router.replace('/auth/login');
//       else if (allowedRoles.length && !allowedRoles.includes(user.role)) {
//         router.replace('/unauthorized');
//       }
//     }
//   }, [user, loading, allowedRoles]);

//   if (loading || !user) return null;

//   return children;
// };

// export default ProtectedRoute;
