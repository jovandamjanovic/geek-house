"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "./LoginForm";

interface ProtectedPageProps {
  children: ReactNode;
}

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      {/* Logout button */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-end">
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Odjavite se
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
