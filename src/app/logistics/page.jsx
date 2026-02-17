"use client";
import Banner from "@/components/Banner/Banner";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Plus, Minus, Plane, Ship, Truck } from "lucide-react";

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

  const freightServices = [
    {
      Icon: Plane,
      title: "Air Freight service",
      options: {
        title: "2 options for international air freight",
        items: ["Door-to-door delivery", "Door-to-airport service"],
      },
      services: {
        title: "Services included",
        items: [
          "Custom Clearance",
          "ATA carnet (temporary admission)",
          "Legalization of Certificate of Origin",
        ],
      },
    },
    {
      Icon: Ship,
      title: "Ocean Freight service",
      options: {
        title: "2 options for international ocean freight",
        items: ["Full Container Load (FCL)", "Less than Container Load (LCL)"],
      },
      services: {
        title: "Services included",
        items: [
          "Custom Clearance",
          "Pick-up and delivery",
          "Moving",
          "Legalization of Certificate of Origin",
        ],
      },
    },
    {
      Icon: Truck,
      title: "Land Freight service",
      options: {
        title: "4 options for ground transportation",
        items: [
          "Truckload (TL)",
          "Less Than Truckload (LTL)",
          "Pallet shipping",
          "Solution for oversized shipments",
        ],
      },
      services: {
        title: "Services included",
        items: ["Custom Clearance", "Legalization of Certificate of Origin"],
      },
    },
  ];

  const accordionItems = [
    {
      title: "Parcel delivery",
      content:
        "We have been moving your goods since 1990 and are committed to providing you with a great service every time",
    },
    {
      title: "Parcels throughout Europe",
      content:
        "Send parcels throughout Europe with our DPD Classic service—from Spain to Denmark, Germany to Estonia, the Netherlands to Austria, and more. We also offer domestic services within each of these countries; for example, from one address in France to another.",
    },
    {
      title: "Freight",
      content:
        "We combine longstanding freight expertise with a suite of freight services tailored to your shipping needs. Our relationship with international carriers and shipping companies, following over 20 years in the freight forwarding business, allows us to negotiate the best possible rates.",
    },
    {
      title: "Fulfillment services",
      content:
        "With fulfilment services from Europa Lieferung Express, we'll store your inventory at our depot and ship out to your customers. It saves time and effort on your part, and allows your business to stay flexible and responsive as your consumer base grows.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Banner
        location={"/contact"}
        img={"/images/pexels-dibert-1117211.jpg"}
        h2Text={"Logistics solutions for an efficient,"}
        spanText={"reliable international supply chain"}
        pText={"Find out what we can do for your business!"}
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
         <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-8">
            Experience reliable shipping and comprehensive logistics solutions with
            AirPets Global Logistics
          </h1>
        <div className="space-y-6 text-gray-600">
          <p className="leading-relaxed">
            At AirPets Global Logistics, our comprehensive services cover international 
            freight forwarding via air, sea, or land, ensuring reliability and 
            efficiency for all your shipments. We provide professional logistics 
            solutions tailored to your business needs.
          </p>
          <p className="leading-relaxed">
            Benefit from our tailored and cost-effective turnkey solutions,
            meticulously crafted to address even the most intricate logistics
            needs. Whether you require Full Container Load (FCL) or Less than
            Container Load (LCL) options, our flexible approach guarantees
            secure, reliable, and swift freight forwarding services.
          </p>
          <p className="leading-relaxed">
            Trust us to strengthen your supply chain, facilitating seamless
            shipments worldwide. Partner with FastLane for unparalleled
            logistics expertise and service excellence.
          </p>
        </div>
      </div>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-3xl font-bold text-secondary-800 mb-6">
                Our comprehensive shipping and logistics services
              </h2>
            <p className="text-gray-600 mb-4">
              Whether you require cross-border shipments, streamlined freight 
              services, or comprehensive logistics solutions, AirPets Global 
              Logistics is your trusted partner for reliable, efficient transportation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freightServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-secondary-800 p-6 text-center">
                  <service.Icon className="w-16 h-16 mx-auto mb-4 text-white" />
                  <h3 className="text-xl font-semibold text-white">
                    {service.title}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-semibold text-secondary-800 mb-3">
                      {service.options.title}
                    </h4>
                    <ul className="space-y-2">
                      {service.options.items.map((item, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <Check className="w-5 h-5 text-accent-500 mr-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-800 mb-3">
                      {service.services.title}
                    </h4>
                    <ul className="space-y-2">
                      {service.services.items.map((item, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <Check className="w-5 h-5 text-accent-500 mr-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-3xl font-bold text-secondary-800 mb-6">
                Logistics experts and shipping specialists at your service!
              </h2>
            <p className="text-gray-600 mb-8">
              Would you like more information about our shipping and logistics 
              services? Contact us today to learn more. Our logistics 
              experts and shipping specialists will be happy to discuss 
              your specific requirements.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate.push("/contact")}
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-lg transition-colors duration-300"
              >
                CONTACT US
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-100 rounded-lg"></div>
            <div className="space-y-4">
              {accordionItems.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 last:border-b-0"
                  onClick={() => setStage(index + 1)}
                >
                  <div className="flex justify-between items-center py-4 cursor-pointer">
                    <h3 className="text-lg font-medium text-secondary-800 capitalize">
                      {item.title}
                    </h3>
                    {stage === index + 1 ? (
                      <Minus className="w-5 h-5 text-accent-500" />
                    ) : (
                      <Plus className="w-5 h-5 text-accent-500" />
                    )}
                  </div>
                  {stage === index + 1 && (
                    <p className="text-gray-600 pb-4">{item.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 space-y-8">
            <p className="text-gray-600 text-sm">
              With supply chains becoming ever more complex and global, a
              company's ability to effectively control and maintain visibility
              of processes, data flows and the status of shipments is critical
              to remaining competitive.
            </p>
            <p className="text-gray-600 text-sm">
              To assist clients with this challenge, Europa Lieferung Express
              have developed a Lead Logistics Provider (LLP or 4PL) solution
              that delivers:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-secondary-800 mb-4">
                  APPROACH
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
                    Global, regional and local strategies
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
                    End-to-end supply chain visibility
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
                    Ensures data quality
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
                    Management of legislative developments
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary-800 mb-4">
                  PLANNING
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
                    Process management
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
                    Identify consolidation opportunities
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
                    Continuous improvement
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>
                    Transport mode migration- air to sea
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Page;
