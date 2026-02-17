"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone, Mail, ChevronRight, ArrowUpRight } from "lucide-react";

// Custom hook for media query
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      window.addEventListener("resize", listener);
      return () => window.removeEventListener("resize", listener);
    }
  }, [matches, query]);

  return matches;
};

function Navbar() {
  const isMobile = useMediaQuery("(max-width:1024px)");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
        setIsScrolled(false);
        return;
      }

      // Hide navbar only after scrolling down a significant amount
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let timeoutId;
      const handleScroll = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(controlNavbar, 10);
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [controlNavbar]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/warehouse", label: "Warehouse" },
    { href: "/logistics", label: "Logistics" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] animate-fadeIn"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main Navigation Container */}
      <div
        className={`
          fixed top-0 left-0 right-0 z-[999] 
          transition-all duration-500 ease-in-out
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
          ${
            isScrolled
              ? "bg-white/95 backdrop-blur-sm shadow-lg"
              : "bg-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-2">
          <div
            className={`
              flex justify-between items-center transition-all duration-300
              ${isScrolled ? "h-16" : "h-24"}
            `}
          >
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => router.push("/")}
            >
              <Image
                src={"/images/Screenshot__29_-removebg-preview.png"}
                width={500}
                height={500}
                alt="Logo"
                className={`
                  h-auto object-contain transition-all duration-300
                  ${isScrolled ? "w-28" : "w-36"}
                `}
                priority
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 text-base font-medium rounded-md
                    transition-all duration-200 
                    ${
                      path === link.href
                        ? "text-accent-400 font-semibold"
                        : `text-${
                            isScrolled ? "gray-700" : "white"
                          } hover:text-accent-400`
                    }
                    group
                  `}
                  onMouseEnter={() => setActiveHover(link.href)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  <span className="relative z-10">{link.label}</span>

                  {/* Active indicator */}
                  <span
                    className={`
                      absolute bottom-0 left-0 w-full h-0.5 bg-accent-400
                      transform origin-left transition-transform duration-300 ease-out
                      ${
                        path === link.href
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }
                    `}
                  />

                  {/* Hover background */}
                
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                lg:hidden p-2 rounded-md transition-colors
                ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/20"
                }
              `}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white/95 backdrop-blur-sm
          shadow-2xl transform transition-all duration-300 ease-out
          z-[999] overflow-y-auto
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col px-4 py-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center justify-between px-4 py-4 rounded-lg
                ${
                  path === link.href
                    ? "bg-accent-50 text-accent-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }
                transition-all duration-200 ease-in-out
              `}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={path === link.href ? "font-medium" : ""}>
                {link.label}
              </span>
              <ChevronRight
                className={`h-5 w-5 transition-transform ${
                  path === link.href ? "text-accent-600" : ""
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Mobile Contact Info */}
      </div>
    </>
  );
}

export default Navbar;
