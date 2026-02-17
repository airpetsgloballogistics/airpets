"use client";

import Image from "next/image";
import "animate.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useEffect } from "react";
import OwlCarousel from "@/components/OwlCarousel/OwlCarousel";
import Navbar from "@/components/Navbar/Navbar";
import Banner from "@/components/Banner/Banner";
import Content from "@/components/Content/Content";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      mirror: false,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    import("jquery").then(($) => {
      window.jQuery = $;
      require("owl.carousel");
    });
  }, []);

  return (
    <>
      <Navbar />
      <Banner
        h2Text="Transform Your Global Shipping Experience"
        pText="Elevate your logistics with our premium worldwide delivery services. Experience seamless shipping solutions that combine innovation, reliability, and exceptional speed at competitive rates."
        spanText="International Logistics"
        img="/images/pexels-albinberlin-906982.jpg"
        location="/contact"
        height="100vh"
      />
      <Content />
      <Footer />
    </>
  );
}
