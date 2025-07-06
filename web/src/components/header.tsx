"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Menu, User, X } from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-context";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
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
            <Link href="/mcp" className={`text-sm font-medium ${isActive('/mcp') ? 'text-[#d97757]' : 'text-gray-600 hover:text-gray-900'}`}>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#d97757] text-white ml-1 mr-1">
                New
              </span>
              MCP
            </Link>
            <Link href="/templates" className={`text-sm font-medium ${isActive('/templates') ? 'text-[#d97757]' : 'text-gray-600 hover:text-gray-900'}`}>
              Templates
            </Link>

            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/profile">
                      <Button variant="outline" className="flex items-center space-x-2">
                        <User size={16} />
                        <span>Profile</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => signOut()}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/auth/login">
                      <Button variant="outline">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
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
              href="/explore"
              className={`block px-3 py-2 rounded-md ${isActive('/explore') ? 'bg-gray-100 text-[#d97757]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/mcp"
              className={`block px-3 py-2 rounded-md ${isActive('/mcp') ? 'bg-gray-100 text-[#d97757]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              MCP
            </Link>
            <Link
              href="/templates"
              className={`block px-3 py-2 rounded-md ${isActive('/templates') ? 'bg-gray-100 text-[#d97757]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Templates
            </Link>

            {!isLoading && (
              <>
                {user ? (
                  <div className="space-y-2 px-3 py-2">
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                        <User size={16} />
                        <span>Profile</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-gray-600 hover:text-gray-900"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 px-3 py-2">
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-[#d97757] hover:bg-[#c86a4a] text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
} 