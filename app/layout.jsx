import ClientLayout from "@/components/layout/ClientLayout";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "ChowBox",
  description: "Enterprise Vending System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
