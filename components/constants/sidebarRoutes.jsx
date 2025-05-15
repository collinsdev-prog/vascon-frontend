
export const sidebarRoutes = {
    seller: [
      { name: "Dashboard", path: "/dashboard/seller", icon: "grid" },
      { name: "Products", path: "/products", icon: "box" },
      { name: "Add Product", path: "/dashboard/seller/products/add", icon: "plus-circle" },
      { name: "Profile", path: "/dashboard/profile", icon: "user" },
    ],
    buyer: [
      { name: "Dashboard", path: "/dashboard/buyer", icon: "home" },
      { name: "Deposit", path: "/dashboard/buyer/deposit", icon: "dollar-sign" },
      { name: "Buy", path: "/dashboard/buyer/buy", icon: "shopping-bag" },
      { name: "Products", path: "/products", icon: "shopping-cart" },
      { name: "Purchase History", path: "/dashboard/buyer/history", icon: "clock" },
      { name: "Profile", path: "/dashboard/profile", icon: "user" },
    ],
  };
  