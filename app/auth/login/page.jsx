"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { toast } from "sonner";
import ForceLoginModal from "@/components/auth/ForceLoginModal";

export default function LoginPage() {
  const { login, forceLogin, user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [terminateOtherSessions, setTerminateOtherSessions] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const roleRoute = user.role === "seller" ? "/dashboard/seller"
                      : user.role === "buyer" ? "/dashboard/buyer"
                      : "/products";
      router.push(roleRoute);
    }
  }, [user, loading, router]);

  if (loading || user) return null;

  const handleLogin = async (email, password) => {
    setFormLoading(true);
    setFormError(null);

    const res = await login(email, password);

    setFormLoading(false);
    if (res.success === false && res.decision_required) {
      setActiveSessions(res.active_sessions);
      setShowModal(true);
    } else if (res.success) {
      toast.success(`Welcome back, ${res.user.username || res.user.name || "User"}!`);
      const roleRoute = res.user.role === "buyer" ? "/dashboard/buyer"
                      : res.user.role === "seller" ? "/dashboard/seller"
                      : "/dashboard";
      router.push(roleRoute);
    } else {
      setFormError(res.message || "Login failed. Please try again.");
    }

    return res;
  };

  const handleForceLogin = async () => {
    const res = await forceLogin(form.email, form.password, terminateOtherSessions);
    if (res.success) {
      toast.success("You have successfully logged in!");
      setShowModal(false);
      router.push("/dashboard");
    } else {
      toast.error(res.message || "Force login failed.");
    }
  };

  return (
    <>
      <LoginForm
        form={form}
        setForm={setForm}
        error={formError}
        onSubmit={handleLogin}
        loading={formLoading}
      />

      {showModal && (
        <ForceLoginModal
          activeSessions={activeSessions}
          terminateOtherSessions={terminateOtherSessions}
          onTerminateChange={(e) => setTerminateOtherSessions(e.target.checked)}
          onClose={() => setShowModal(false)}
          onForceLogin={handleForceLogin}
        />
      )}
    </>
  );
}
