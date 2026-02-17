"use client";
import Banner from "@/components/Banner/Banner";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  Plane,
  Ship,
  Package,
  Clock,
  Globe,
  Shield,
  DollarSign,
} from "lucide-react";

function Page() {
  const navigate = useRouter();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    Aos.init({
      duration: 500,
      once: true,
    });
  }, []);

  const phoneNumber = "";
  const preFilledMessage =
    "Hello! I need assistance with tracking my shipment. Thank you!";
  const encodedMessage = encodeURIComponent(preFilledMessage);
  const smsLink = `sms:${phoneNumber}?&body=${encodedMessage}`;

  const services = [
    {
      icon: <Globe className="w-12 h-12 text-accent-500" />,
      title: "Global Coverage",
      description: "Reach over 220 countries and territories worldwide",
    },
    {
      icon: <Clock className="w-12 h-12 text-accent-500" />,
      title: "Express Delivery",
      description: "Time-sensitive solutions for urgent shipments",
    },
    {
      icon: <Shield className="w-12 h-12 text-accent-500" />,
      title: "Secure Handling",
      description: "State-of-the-art tracking and security measures",
    },
    {
      icon: <DollarSign className="w-12 h-12 text-accent-500" />,
      title: "Competitive Rates",
      description: "Cost-effective solutions for all shipping needs",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Banner
        location={"/contact"}
        img={"/images/banr.jpg"}
        h2Text={"FastLane Global Courier:"}
        pText={"Your trusted partner for international shipping"}
        button={"CONTACT US"}
      />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-secondary-800 mb-6">
              Reliable Shipping & Logistics Services
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AirPets Global Logistics offers reliable, efficient shipping 
              and logistics services at competitive rates. With over a decade 
              of experience in international freight and logistics, our 
              professional team ensures safe, timely delivery of your 
              packages and cargo.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Solutions Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-800 mb-6">
              Comprehensive Shipping Solutions
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              From individual parcels to full container loads, we offer tailored
              solutions for all your shipping needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Air Freight */}
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              data-aos="fade-up"
            >
              <Plane className="w-12 h-12 text-accent-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Air Freight</h3>
              <p className="text-gray-600">
                Express air freight services with guaranteed delivery times and
                real-time tracking.
              </p>
            </div>

            {/* Ocean Freight */}
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <Ship className="w-12 h-12 text-accent-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Ocean Freight</h3>
              <p className="text-gray-600">
                Cost-effective ocean freight solutions for larger shipments with
                FCL and LCL options.
              </p>
            </div>

            {/* Road Freight */}
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Truck className="w-12 h-12 text-accent-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Road Freight</h3>
              <p className="text-gray-600">
                Reliable ground transportation services with extensive coverage
                and flexible scheduling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Ship with FastLane Global?
          </h2>
          <p className="mb-8 text-gray-300 max-w-2xl mx-auto">
            Contact our team today for a personalized quote and experience our
            world-class shipping services.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate.push("/contact")}
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-full transition-colors duration-300"
            >
              Contact Us
            </button>
            <Link
              href="/tracking"
              className="border-2 border-white hover:bg-white hover:text-secondary-800 px-8 py-3 rounded-full transition-colors duration-300"
            >
              Track Shipment
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-800 mb-6">
              Why Choose FastLane Global?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We combine decades of experience with cutting-edge technology to
              deliver exceptional shipping services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "25+ Years Experience",
                description:
                  "Decades of expertise in international shipping and logistics.",
              },
              {
                title: "Global Network",
                description:
                  "Extensive coverage across 220+ countries and territories.",
              },
              {
                title: "24/7 Support",
                description:
                  "Round-the-clock customer service and shipment monitoring.",
              },
              {
                title: "Custom Solutions",
                description:
                  "Tailored shipping solutions for your specific needs.",
              },
              {
                title: "Competitive Pricing",
                description:
                  "Cost-effective rates without compromising on service quality.",
              },
              {
                title: "Advanced Tracking",
                description:
                  "Real-time tracking and status updates for all shipments.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-lg"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Page;
