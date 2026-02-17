"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import "animate.css";
import { ArrowRight } from "lucide-react";

function Banner({ spanText, h2Text, pText, img, location, height }) {
  const path = usePathname();

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden "
        style={{ height: height || "100vh" }}
      >
        {/* Banner Image with Overlay */}
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image
              src={img}
              alt="banner image"
              fill
              priority
              quality={95}
              sizes="100vw"
              className="object-cover w-full h-full"
              data-aos="zoom-out"
              data-aos-duration="1500"
            />
            {/* Modern Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-800/95 via-secondary-800/85 to-transparent"></div>
          </div>
        </div>
<div className="max-w-[1600px] absolute top-0 left-0 right-0 bottom-0 mx-auto   ">

        {/* Main Content */}
        <div className="absolute z-10 text-white lg:left-[8%] md:left-[5%] left-[4%] lg:top-[20%] md:top-[30%] top-[25%] lg:w-[900px] md:w-[600px] w-[92%] max-w-[92%]">
          <div className="space-y-6">
            {/* Top Label */}
            {spanText && (
              <div className="inline-block animate__animated animate__fadeInUp animate__delay-1s">
                <span className="text-accent-500 uppercase tracking-[4px] text-sm font-medium border-b-2 border-accent-500 pb-2">
                  {spanText}
                </span>
              </div>
            )}

            {/* Main Heading */}
            {h2Text && (
              <h2 className="lg:text-[68px] md:text-[50px] text-[40px] font-bold leading-tight animate__animated animate__fadeInUp animate__delay-1s">
                <span className="text-white">{h2Text}</span>
                <span className="text-accent-500">.</span>
              </h2>
            )}

            {/* Description Text */}
            {pText && (
              <p className="text-gray-300 lg:text-xl md:text-lg text-base leading-relaxed max-w-[700px] animate__animated animate__fadeInUp animate__delay-2s">
                {pText}
              </p>
            )}

            {/* Stats Section */}
            <div className="flex flex-wrap gap-12 mt-8 animate__animated animate__fadeInUp animate__delay-2s">
              <div className="stat-item">
                <span className="block text-accent-500 text-4xl font-bold mb-2">
                  50+
                </span>
                <span className="text-gray-300 text-sm uppercase tracking-wider">
                  Countries Served
                </span>
              </div>
              <div className="stat-item">
                <span className="block text-accent-500 text-4xl font-bold mb-2">
                  24/7
                </span>
                <span className="text-gray-300 text-sm uppercase tracking-wider">
                  Customer Support
                </span>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex items-center gap-8 mt-10 animate__animated animate__fadeInUp animate__delay-3s">
              <Link href="#tracking">
                  <button className="group flex items-center gap-2 text-white hover:text-accent-500 transition-colors duration-300">
                  <span className="text-lg font-medium">
                    Start Shipping Now
                  </span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              <div className="h-8 w-[1px] bg-gray-500/30"></div>
              <Link href="#tracking">
                <button className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
                  <span className="text-lg font-medium">Track Package</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-[8%] animate__animated animate__fadeIn animate__delay-3s hidden md:flex items-center gap-4">
          <div className="w-12 h-[1px] bg-accent-500"></div>
          <span className="text-white text-sm uppercase tracking-wider">
            Scroll to explore
          </span>
        </div>
</div>
      </div>
    </div>
  );
}

export default Banner;
