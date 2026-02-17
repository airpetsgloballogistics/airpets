"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./Content.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShipmentContext from "@/contexts/ShipmentContext";
import {
  ArrowRight,
  Calendar,
  Truck,
  Dog,
  Car,
  FileCheck,
  Shield,
} from "lucide-react";

const Counter = ({ start, end, duration }) => {
  const [count, setCount] = useState(start);
  const ref = useRef();

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [start, end, duration]);

  return (
    <h2 ref={ref} className="num">
      {count.toLocaleString()}
    </h2>
  );
};

function Content() {
  const navigate = useRouter();
  const [revCount, setRevCount] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();
  const [loading, setLoading] = useState(false);

  const [trackingNumber, setTrackingNumber] = useState("");
  const {
    shipments,
    setShipments,
    shipmentStatus,
    setShipmentStatus,
    shipmentPosition,
    setShipmentPosition,
  } = useContext(ShipmentContext);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError(null); // Reset error state
    setShipments(null); // Reset shipment state
    console.log(trackingNumber);
    try {
      const res = await fetch("/api/getShipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackingNumber }),
      });

      console.log(res.status);
      if (res.status === 200) {
        setLoading(false);
        const data = await res.json();
        setShipments(data.shipmentData);
        navigate.push(`/shipment?num=${trackingNumber}`);
      } else if (res.status === 400) {
        setLoading(false);
        setError("invalid Input");
      } else {
        setLoading(false);
        const errorData = await res.json();
        throw new Error(errorData.message || "Shipment not found");
      }
    } catch (error) {
      setLoading(false);

      console.error("Error caught:", error);
      setError(error.message);
    }
  };

  const handleNext = () => {
    setRevCount((prev) => prev + 1);
    if (revCount === 7) {
      setRevCount(1);
    }
  };
  const handlePrev = () => {
    setRevCount((prev) => prev - 1);
    if (revCount <= 1) {
      setRevCount(7);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      clearInterval(interval); // Clear interval on component unmount
    };
  }, [handleNext]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
  }, []);
  const phoneNumber = ""; // Replace with your phone number
  const preFilledMessage =
    "Hello! I need assistance with tracking my shipment. Thank you!";

  // URL encode the message
  const encodedMessage = encodeURIComponent(preFilledMessage);

  // Create the SMS link
  const smsLink = `sms:${phoneNumber}?&body=${encodedMessage}`;

  return (
    <>
      <section className="w-full bg-white py-16">
        <div id="tracking" className="container mx-auto px-4 max-w-[1400px]">
          <div className="space-y-10">
            {/* Header Section */}
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-800">
                Track Your Shipment
                <span className="text-accent-500">.</span>
              </h2>
              <p className="text-gray-600 text-lg mt-4">
                Enter your tracking number to get real-time updates on your
                package
              </p>
            </div>

            {/* Tracking Form */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="relative flex flex-col md:flex-row gap-4 max-w-4xl">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter Tracking Number"
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all duration-300 text-lg"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={handleTrack}
                  className="group relative md:w-auto w-full px-8 py-4 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-all duration-300 flex items-center justify-center gap-2 min-w-[160px]"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        Track Now
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Example and Error Messages */}
              <div className="mt-4">
                <p className="text-gray-500 text-sm">
                  Example Tracking Number: 1234-5678-9012
                </p>
                {error && (
                  <div className="mt-3 bg-accent-50 text-accent-500 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-500/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-accent-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-secondary-800 font-semibold text-lg">
                    Real-Time Updates
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Track your shipment status with instant updates and
                    notifications
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-500/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-accent-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-secondary-800 font-semibold text-lg">
                    Secure Tracking
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Your tracking information is protected with advanced
                    security
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-500/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-accent-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-secondary-800 font-semibold text-lg">
                    Global Coverage
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Track packages worldwide with our international shipping
                    network
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            ref={ref}
          >
            {/* Left Side - Image */}
            <div className="relative" data-aos="fade-up">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  width={1000}
                  height={1000}
                  src={
                    "https://images.pexels.com/photos/4481260/pexels-photo-4481260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  }
                  alt="Courier Service"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                />
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent-500/10 rounded-full z-0"></div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary-800/10 rounded-full z-0"></div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8" data-aos="fade-up">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-secondary-800 leading-tight">
                  Reliable Global Logistics & Shipping Solutions
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  AirPets Global Logistics provides comprehensive shipping and logistics 
                  services worldwide. Our experienced team ensures your packages and cargo 
                  reach their destination safely and on time. We offer reliable, efficient 
                  transportation solutions for all your shipping needs.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8">
                {/* Stat 1 */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <div className="text-4xl lg:text-5xl font-bold text-accent-500">
                      {isVisible && (
                        <Counter start={0} end={7} duration={3000} />
                      )}
                    </div>
                    <div className="text-4xl lg:text-5xl font-bold text-accent-500">
                      M+
                    </div>
                  </div>
                  <p className="text-gray-600">
                    successful deliveries since 2010
                  </p>
                </div>

                {/* Stat 2 */}
                <div className="space-y-2">
                  <div className="text-4xl lg:text-5xl font-bold text-accent-500">
                    {isVisible && (
                      <Counter start={0} end={194772} duration={3000} />
                    )}
                  </div>
                  <p className="text-gray-600">satisfied customers served</p>
                </div>

                {/* Stat 3 */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <div className="text-4xl lg:text-5xl font-bold text-accent-500">
                      +
                    </div>
                    <div className="text-4xl lg:text-5xl font-bold text-accent-500">
                      {isVisible && (
                        <Counter start={0} end={95} duration={3000} />
                      )}
                    </div>
                    <div className="text-4xl lg:text-5xl font-bold text-accent-500">
                      %
                    </div>
                  </div>
                  <p className="text-gray-600">on-time delivery rate</p>
                </div>

                {/* Stat 4 */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <div className="text-4xl lg:text-5xl font-bold text-accent-500">
                      {isVisible && (
                        <Counter start={0} end={200} duration={3000} />
                      )}
                    </div>
                    <div className="text-4xl lg:text-5xl font-bold text-accent-500">
                      +
                    </div>
                  </div>
                  <p className="text-gray-600">delivery professionals worldwide</p>
                </div>
              </div>

              {/* Additional Decorative Element */}
              <div className="absolute -bottom-10 right-10 w-40 h-40 bg-secondary-800/5 rounded-full blur-3xl z-0"></div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-gray-50 py-24">
        <div className="container mx-auto px-4 max-w-[1400px]">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-800">
              Comprehensive Shipping & Logistics Services
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              AirPets Global Logistics provides comprehensive shipping and logistics 
              solutions tailored to your business needs. Our experienced team combines 
              industry expertise with advanced technology to ensure reliable, efficient 
              delivery of your packages and cargo.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Rail Freight */}
            <div
              className="bg-white rounded-2xl  shadow-lg hover:shadow-xl transition-all duration-300 group"
              data-aos="fade-up"
            >
              <div className="h-48 flex items-center rounded-t-2xl justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image
                  width={200}
                  height={200}
                  src="https://images.pexels.com/photos/1793503/pexels-photo-1793503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Make sure to add appropriate image
                  alt="Rail Freight"
                  className="w-full rounded-t-2xl h-full object-cover"
                />
              </div>
              <div className="space-y-4 px-4">
                <h3 className="text-2xl font-bold text-secondary-800">
                  Rail Freight
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Safe and eco-friendly rail transportation across Europe and
                  Asia. Perfect for both Groupage and Full Container shipments,
                  offering:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Environmentally friendly transport
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Europe-Asia connectivity
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Reliable scheduling
                  </li>
                </ul>
              </div>
            </div>

            {/* Ocean Freight */}
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="h-48 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image
                  width={200}
                  height={200}
                  src="https://images.pexels.com/photos/31007138/pexels-photo-31007138/free-photo-of-large-container-ship-in-hamburg-harbor.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Make sure to add appropriate image
                  alt="Ocean Freight"
                  className="w-full h-full rounded-t-2xl object-cover"
                />
              </div>
              <div className="space-y-4 px-4">
                <h3 className="text-2xl font-bold text-secondary-800">
                  Ocean Freight
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive ocean freight solutions with various equipment
                  options and groupage services, featuring:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Cost-effective shipping
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Global port coverage
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Flexible container options
                  </li>
                </ul>
              </div>
            </div>

            {/* Road Freight */}
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="h-48 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image
                  width={200}
                  height={200}
                  src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Make sure to add appropriate image
                  alt="Road Freight"
                  className="w-full h-full rounded-t-2xl object-cover"
                />
              </div>
              <div className="space-y-4 px-4">
                <h3 className="text-2xl font-bold text-secondary-800">
                  Road Freight
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Scheduled departures on major commercial routes worldwide,
                  providing:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Precise planning
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Door-to-door delivery
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Regular scheduled services
                  </li>
                </ul>
              </div>
            </div>

            {/* Air Freight */}
            <div
              className="bg-white rounded-2xl  shadow-lg hover:shadow-xl transition-all duration-300 group"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="h-48 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image
                  width={200}
                  height={200}
                  src="https://images.pexels.com/photos/70347/cargo-jet-c-17-airdrop-humvee-70347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Make sure to add appropriate image
                  alt="Air Freight"
                  className="w-full h-full rounded-t-2xl object-cover"
                />
              </div>
              <div className="space-y-4 px-4">
                <h3 className="text-2xl font-bold text-secondary-800">
                  Air Freight
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Fast and reliable air freight services on major global routes
                  with:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Express delivery options
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Worldwide coverage
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    Time-critical solutions
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
        </div>
      </section>

      <section className="central">
        <section className="w-full">
          {/* First Section - Card Grid */}

          <section className="w-full py-24 bg-gray-50">
            <div className="container mx-auto px-4 max-w-[1400px]">
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 leading-tight">
                  Why Choose AirPets Global Logistics?
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  AirPets Global Logistics combines reliability, efficiency, and cutting-edge 
                  technology to provide comprehensive shipping and logistics services. Our 
                  experienced team, advanced tracking systems, and dedicated customer support 
                  ensure your packages and cargo receive the highest level of service throughout 
                  their journey.
                </p>
              </div>

              {/* Services Grid */}
              <div className="container mx-auto px-4 max-w-[1400px] overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                  {/* Pet Shipping Card */}
                  <div
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-20 flex items-center justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-accent-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Dog className="w-8 h-8 text-accent-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-800 mb-4 text-center">
                      Reliable Package Delivery
                    </h3>
                    <p className="text-gray-600 text-center">
                      Our experienced delivery team ensures your packages are handled 
                      with care and delivered safely. We provide secure transport, 
                      real-time tracking, and professional service throughout 
                      the delivery process.
                    </p>
                  </div>

                  {/* Automobile Transport Card */}
                  <div
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-20 flex items-center justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-accent-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Car className="w-8 h-8 text-accent-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-800 mb-4 text-center">
                      Vehicle Transportation
                    </h3>
                    <p className="text-gray-600 text-center">
                      Professional vehicle transportation services with secure carriers 
                      and comprehensive insurance coverage. Our experienced drivers ensure 
                      your vehicle arrives safely and on time, whether it's a personal 
                      car or commercial vehicle.
                    </p>
                  </div>

                  {/* Custom Clearance Card */}
                  <div
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-20 flex items-center justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-accent-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FileCheck className="w-8 h-8 text-accent-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-800 mb-4 text-center">
                      Customs & Documentation
                    </h3>
                    <p className="text-gray-600 text-center">
                      Our customs specialists handle all documentation and clearance 
                      procedures for your shipments. We navigate complex international 
                      regulations to ensure smooth, compliant transportation across borders.
                    </p>
                  </div>

                  {/* Private Shipping Card */}
                  <div
                    data-aos="fade-up"
                    data-aos-delay="400"
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-20 flex items-center justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-accent-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-8 h-8 text-accent-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-800 mb-4 text-center">
                      Secure & Private Shipping
                    </h3>
                    <p className="text-gray-600 text-center">
                      Discreet shipping services for sensitive packages and special 
                      requirements. We maintain complete confidentiality and provide 
                      secure, professional transport with enhanced privacy protocols.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-16 text-center">
                <div className="inline-flex flex-col md:flex-row gap-4 items-center justify-center">
                  <button
                    onClick={() => navigate.push("/contact")}
                    className="bg-accent-500 text-white px-8 py-3 rounded-lg hover:bg-accent-600 transition-colors duration-300 font-medium w-full md:w-auto"
                  >
                    Contact Us
                  </button>
                  <button
                    onClick={() => navigate.push("/logistics")}
                    className="bg-secondary-800 text-white px-8 py-3 rounded-lg hover:bg-secondary-900 transition-colors duration-300 font-medium w-full md:w-auto"
                  >
                    Our Services
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Second Section - Benefits (Keeping your existing code) */}
          <section className="w-full py-24 bg-white">
            {/* ... Your existing benefits section code ... */}
          </section>

          <section className="w-full py-24 bg-white">
            <div className="container mx-auto px-4 max-w-[1400px]">
              {/* Header Section */}
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-secondary-800 leading-tight">
                  Insights And Trends
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Follow our latest news and thoughts which focuses exclusively
                  on insight, industry trends, top news headlines.
                </p>
              </div>

              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Article 1 */}
                <div
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  data-aos="fade-up"
                >
                  <div className="relative h-64 rounded-t-xl overflow-hidden">
                    <Image
                      width={600}
                      height={400}
                      src="https://images.pexels.com/photos/4391486/pexels-photo-4391486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Cargo Article"
                      className="w-full h-full object-cover object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm">
                        Cargo
                      </span>
                      <span className="ml-2 bg-secondary-800 text-white px-3 py-1 rounded-full text-sm">
                        Insights
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-secondary-800 group-hover:text-accent-500 transition-colors duration-300">
                      Importers achieve cost savings through the First Sale
                      rule!
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      The trade war currently ensuing between the nations around
                      the globe, fiercely with China, shows no signs of the
                      first set of tariffs levied against solar...
                    </p>
                    <button className="flex items-center text-accent-500 font-medium hover:text-secondary-800 transition-colors duration-300">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>

                {/* Article 2 */}
                <div
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="relative h-64 rounded-t-xl overflow-hidden">
                    <Image
                      width={600}
                      height={400}
                      src="https://images.pexels.com/photos/6169641/pexels-photo-6169641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Warehouse Article"
                      className="w-full h-full object-cover object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm">
                        Warehouse
                      </span>
                      <span className="ml-2 bg-secondary-800 text-white px-3 py-1 rounded-full text-sm">
                        Construction
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-secondary-800 group-hover:text-accent-500 transition-colors duration-300">
                      Cargo flow through better supply chain visibility,
                      control.
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      Global provider connected products for consumers, and
                      enterprises worldwide, supply chain control is everything,
                      provide visibility and traceability needed for...
                    </p>
                    <button className="flex items-center text-accent-500 font-medium hover:text-secondary-800 transition-colors duration-300">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>

                {/* Article 3 */}
                <div
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="relative h-64 rounded-t-xl overflow-hidden">
                    <Image
                      width={600}
                      height={400}
                      src="https://images.pexels.com/photos/6169052/pexels-photo-6169052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Logistics Article"
                      className="w-full h-full object-cover object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm">
                        Logistics
                      </span>
                      <span className="ml-2 bg-secondary-800 text-white px-3 py-1 rounded-full text-sm">
                        Distribution
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-secondary-800 group-hover:text-accent-500 transition-colors duration-300">
                      Importance of specialized focus in Projects, Oil & Gas
                      Logistics?
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      Our team provides skilled & experienced managers who know
                      the intricacies of this vertical and focus on providing
                      solutions in Oil & Gas sector...
                    </p>
                    <button className="flex items-center text-accent-500 font-medium hover:text-secondary-800 transition-colors duration-300">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>

              {/* View All Button */}
              <div className="text-center mt-12">
                <button className="bg-accent-500 text-white px-8 py-3 rounded-lg hover:bg-accent-600 transition-colors duration-300 font-medium">
                  View All Articles
                </button>
              </div>
            </div>
          </section>
        </section>
      </section>
      <TestimonialsSection
        revCount={revCount}
        handleNext={handleNext}
        handlePrev={handlePrev}
      />
    </>
  );
}

export default Content;

const TestimonialsSection = ({ revCount, handleNext, handlePrev }) => {
  // Assuming you're keeping the same state management for revCount
  const testimonials = [
    {
      id: 1,
      image: "/images/Bruce-and-Jet.webp",
      text: "AirPets Global Logistics exceeded our expectations when shipping our valuable cargo from Europe to the US. Their team provided regular updates and tracking information, ensuring we were informed throughout the journey. The level of service and attention to detail was remarkable.",
    },
    {
      id: 2,
      image: "/images/Faces-400x400px-1_1_07-thegem-person.webp",
      text: "AirPets Global Logistics provided exceptional service during our business relocation. Their team handled our sensitive shipments with utmost care and professionalism, ensuring everything arrived safely in the UK. Their attention to detail made a complex situation manageable.",
    },
    {
      id: 3,
      image: "/images/Faces-400x400px-1_1_18-thegem-person.webp",
      text: "Our shipment arrived safely in San Francisco thanks to AirPets Global Logistics. Their team made our EU to America delivery seamless, especially when we needed to reschedule due to unexpected circumstances. The flexibility and professionalism they showed was exceptional. I cannot recommend them highly enough.",
    },
    {
      id: 4,
      image: "/images/Faces-400x400px-1_1_28-thegem-person.webp",
      text: "AirPets Global Logistics provided outstanding service at an incredibly competitive price. Their transparent pricing and comprehensive service package made our international shipment both affordable and stress-free. The value for money was exceptional.",
    },
    {
      id: 5,
      image: "/images/gettyimages-1219356771-640x640.jpg",
      text: "AirPets Global Logistics transported my vehicle from the USA to Australia when I relocated for work. Their professional service and competitive rates saved me thousands compared to purchasing a new car. The vehicle arrived in perfect condition.",
    },
    {
      id: 6,
      image: "/blank-profile-picture-973460_640.png",
      text: "AirPets Global Logistics has been our trusted partner for international shipping and cargo transportation. Their service is exceptional, with real-time tracking and outstanding customer support. The peace of mind they provide during our shipments is invaluable. Highly recommend for anyone needing reliable logistics services.",
    },
    {
      id: 7,
      image: "/blank-profile-picture-973460_640.png",
      text: "AirPets Global Logistics made our shipping experience completely stress-free. Their professional team handled our valuable cargo with such care and attention. The shipment arrived ahead of schedule, and the constant communication and tracking updates kept us informed every step of the way. We will definitely use their services again.",
    },
  ];

  return (
    <section className="w-full py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Testimonials Carousel */}
          <div className="lg:w-1/2 w-full relative">
            <div className="max-w-2xl mx-auto relative">
              {/* Testimonials Container */}
              <div className="relative w-full">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`w-full transition-all duration-500 ${
                      revCount === index + 1
                        ? "opacity-100 relative"
                        : "opacity-0 absolute top-0 left-0"
                    }`}
                    style={{
                      transform:
                        revCount === index + 1
                          ? "translateX(0)"
                          : "translateX(100%)",
                      visibility: revCount === index + 1 ? "visible" : "hidden",
                    }}
                  >
                    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 relative">
                      {/* Header */}
                      <h2 className="text-2xl font-bold text-secondary-800 mb-8 text-center">
                        TESTIMONIALS
                      </h2>

                      {/* Profile Image */}
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt="Customer"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Testimonial Text */}
                      <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 text-center break-words">
                        {testimonial.text}
                      </p>

                      {/* Quote Mark */}
                      <div className="text-center">
                        <span className="text-5xl text-accent-500/20 font-serif">
                          ,,
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center text-secondary-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center text-secondary-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/pexels-tima-miroshnichenko-6169137.jpg"
                width={1000}
                height={1000}
                alt="Shipping Services"
                className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover transform hover:scale-105 transition-transform duration-500"
              />
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent-500/10 rounded-full z-0"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary-800/10 rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// <section id="form" class="global-scope">
// {/* <div className="image"></div> */}
// <section class="container">
//   <h4>CONTACT US</h4>
//   {/* <header>Contact us</header> */}
//   <form class="form" action="#">
//     <div class="input-box">
//       <label>Full Name</label>
//       <input required="" placeholder="Enter full name" type="text" />
//     </div>
//     <div class="column">
//       <div class="input-box">
//         <label>Phone Number</label>
//         <input
//           required=""
//           placeholder="Enter phone number"
//           type="telephone"
//         />
//       </div>
//       <div class="input-box">
//         <label>Email</label>
//         <input
//           required=""
//           placeholder="Enter your email"
//           type="email"
//         />
//       </div>
//     </div>
//     <div class="gender-box">
//       <label>Gender</label>
//       <div class="gender-option">
//         <div class="gender">
//           <input name="gender" id="check-male" type="radio" />
//           <label for="check-male">Male</label>
//         </div>
//         <div class="gender">
//           <input name="gender" id="check-female" type="radio" />
//           <label for="check-female">Female</label>
//         </div>
//         <div class="gender">
//           <input name="gender" id="check-other" type="radio" />
//           <label for="check-other">Prefer not to say</label>
//         </div>
//       </div>
//     </div>
//     <div class="input-box address">
//       <label>Address</label>
//       <input
//         required=""
//         placeholder="Enter street address"
//         type="text"
//       />
//       <div class="column">
//         <input required="" placeholder="Country" type="text" />
//         <input required="" placeholder="Enter your city" type="text" />
//       </div>
//     </div>
//     <div class="input-box address">
//       <label>Message</label>
//       <textarea required="" type="text" />
//     </div>
//     <button>Submit</button>
//   </form>
// </section>
// </section>
