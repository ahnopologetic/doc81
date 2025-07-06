"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { Header } from "@/components/header";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <SignupForm />
      </main>
    </div>
  );
} 