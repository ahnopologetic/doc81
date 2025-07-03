"use client";

import { TemplatesList } from "@/components/templates-list";
import { Header } from "@/components/header";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      
      <div className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Template Library</h1>
              <p className="text-xl text-gray-600">
                Browse and use our collection of professional templates
              </p>
            </div>
            
            <TemplatesList />
          </div>
        </div>
      </div>
    </div>
  );
} 