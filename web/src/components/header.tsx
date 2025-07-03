"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-[#d97757]" />
            <span className="font-bold text-xl">Doc81</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`text-sm font-medium ${isActive('/') ? 'text-[#d97757]' : 'text-gray-600 hover:text-gray-900'}`}>
              Home
            </Link>
            <Link href="/templates" className={`text-sm font-medium ${isActive('/templates') ? 'text-[#d97757]' : 'text-gray-600 hover:text-gray-900'}`}>
              Templates
            </Link>
            <Button className="bg-[#d97757] hover:bg-[#c86a4a] text-white">
              Get Started
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md ${isActive('/') ? 'bg-gray-100 text-[#d97757]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/templates"
              className={`block px-3 py-2 rounded-md ${isActive('/templates') ? 'bg-gray-100 text-[#d97757]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Templates
            </Link>
            <div className="px-3 py-2">
              <Button className="w-full bg-[#d97757] hover:bg-[#c86a4a] text-white">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 