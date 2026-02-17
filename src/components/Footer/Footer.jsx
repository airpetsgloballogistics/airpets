"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";

function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:contact@airpetsglobalscm.com?subject=Contact%20Form`;
    window.location.href = mailtoLink;
  };

  const year = new Date().getFullYear();
  const navigate = useRouter();

  return (
    <footer className="bg-secondary-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info Section */}
          <div className="space-y-6">
            <div
              onClick={() => navigate.push("/")}
              className="cursor-pointer inline-block"
            >
              <Image
                src="/images/Screenshot__29_-removebg-preview.png"
                width={200}
                height={80}
                alt="AirPets Global Logistics Logo"
              />
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted partner for reliable shipping and logistics solutions worldwide.
            </p>

            {/* Contact Information */}
            <div className="space-y-4">
              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-3"
              >
                <Mail className="w-5 h-5 text-accent-500" />
                <button className="text-sm hover:text-accent-500 transition-colors">
                  contact@airpetsglobalscm.com{" "}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-accent-500">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { text: "About", href: "/about" },
                { text: "Blog", href: "/logistics" },
                { text: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2"
                  >
                    <span>→</span>
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-accent-500">
              Services
            </h3>
            <ul className="space-y-4">
              {[
                { text: "Express Shipping", href: "/warehouse" },
                { text: "Air Freight", href: "/logistics" },
                { text: "Ocean Freight", href: "/logistics" },
                { text: "Road Freight", href: "/logistics" },
                { text: "Customs Clearance", href: "#" },
              ].map((service) => (
                <li key={service.text}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2"
                  >
                    <span>→</span>
                    <span>{service.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-accent-500">
              Community
            </h3>
            <ul className="space-y-4">
              {[
                { text: "Testimonials", href: "#" },
                { text: "Track Your Shipment", href: "#" },
                { text: "Privacy Policy", href: "#" },
                { text: "Terms & Condition", href: "#" },
              ].map((item) => (
                <li key={item.text}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2"
                  >
                    <span>→</span>
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-400 text-sm">
              &copy; {year} FastLane Global. All Rights Reserved
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* Add your social media icons here if needed */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
