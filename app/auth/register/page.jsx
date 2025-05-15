"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/auth/RegisterForm";
import { toast } from "sonner";

export default function SignupPage() {
  const { register, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'seller') {
        router.push('/dashboard/seller');
      } else if (user.role === 'buyer') {
        router.push('/dashboard/buyer');
      } else {
        router.push('/products');
      }
    }
  }, [user, loading, router]);
  
  // Don't render the form if loading or authenticated
  if (loading || user) return null;

  const handleRegister = async (formData) => {
    const res = await register(formData);
    if (res.success) {
      toast.success("Registration successful!");
      // No need to redirect here - the useEffect will handle it
    } else {
      toast.error(res.message || "Registration failed. Please try again.");
    }
    return res;
  };

  return <SignupForm onSubmit={handleRegister} />;
}