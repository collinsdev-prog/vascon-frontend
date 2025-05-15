'use client';

import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LoadingProvider } from "@/context/LoadingContext";
import GlobalLoader from "../GlobalLoader";
import RouteLoader from "../RouteLoader";
import { Toaster } from "sonner";
import PublicLayout from "./PublicLayout";
import DashboardLayout from "./DashboardLayout";
import { usePathname } from "next/navigation";
import { VendingProvider } from "@/context/VendingContext";
import { ProductsProvider } from "@/context/ProductsContext";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const isDashboardPath =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/products") ||
    pathname?.startsWith("/products/add") ||
    pathname?.startsWith("/products/edit");

  return (
    <LoadingProvider>
      <AuthProvider>
        <VendingProvider>
          <ProductsProvider>
            <GlobalLoader />
            <RouteLoader />
            {isDashboardPath ? (
              <DashboardLayout>{children}</DashboardLayout>
            ) : (
              <PublicLayout>{children}</PublicLayout>
            )}
            <Toaster position="top-right" richColors />
          </ProductsProvider>
        </VendingProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}
