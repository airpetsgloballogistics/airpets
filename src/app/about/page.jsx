"use client";
import Banner from "@/components/Banner/Banner";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Page() {
  const navigate = useRouter();
  useEffect(() => {
    Aos.init({
      duration: 500,
    });
  }, []);

  const phoneNumber = "";
  const preFilledMessage =
    "Hello! I need assistance with tracking my shipment. Thank you!";
  const encodedMessage = encodeURIComponent(preFilledMessage);
  const smsLink = `sms:${phoneNumber}?&body=${encodedMessage}`;

  return (
    <>
      <Navbar />
      <Banner
        img={"/images/pexels-bernard-foss-3049419-4620555.jpg"}
        h2Text={"Reliable parcel pick-up and delivery services,"}
        location={""}
        spanText={" anywhere in the world"}
      />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Your Courier Company for Deliveries within your local environment
            and Abroad
          </h1>
          <p className="text-gray-600 mb-6">
            At FastLane Global Courier, each package is handled with meticulous
            care, guaranteeing complete satisfaction both locally and globally.
            Our commitment goes beyond mere shipping; we craft seamless delivery
            experiences customized to your specific needs.
          </p>
          <p className="text-gray-600 mb-8">
            Our secret? A team of passionate and dedicated experts, working
            diligently to make sure your shipments reach their destination
            safely and on time. We're here to keep our promises, and help you do
            the same.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate.push("/contact")}
              className="bg-accent-600 hover:bg-accent-700 text-white px-8 py-3 rounded-lg transition-colors duration-300"
            >
              CONTACT US TODAY
            </button>
            <Link href={smsLink} className="hidden">
              {""}
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative h-[500px]">
            <Image
              src="/images/bxman.png"
              alt="Company History"
              fill
              className="object-contain"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
              FastLane Global Courier: a success story since 1995
            </h1>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in the dynamic city of Montreal in 1995, FastLane Global
                Courier rose rapidly through the ranks to become a benchmark in
                the world of express delivery.
              </p>
              <p>
                With more than 25 years of experience, we deliver to more than
                220 destinations worldwide. Our name rhymes with reliability and
                efficiency while our values include honouring our commitments
                and respecting the well-being of our team.
              </p>
              <p>
                At FastLane, we adapt to your shipping needs and provide premium
                courier services to a variety of industries including
                manufacturing, textiles, automotive, furniture, engineering and
                architecture.
              </p>
              <p>
                Our pride and joy? We are the official carriers for prestigious
                institutions such as Quebec universities, the Quebec government,
                the Quebec Health Network and much more. We're also recognized
                for our expertise in transporting works of art, and will
                guarantee the safety of your most precious possessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <h1 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-16">
        Reliable services, satisfied customers
      </h1>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
            {[
              {
                number: "7M+",
                text: "orders and still as passionate as ever.",
              },
              { number: "+95%", text: "on-time delivery – Your time matters." },
              {
                number: "200+",
                text: "dynamic delivery drivers in action in Montreal and Quebec City.",
              },
              {
                number: "194772+",
                text: "satisfied partners – Join the family!",
              },
              {
                number: "4.8/5",
                text: "on Google – Your trust in our services makes us proud.",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <h1 className="text-4xl font-bold text-accent-600 mb-2">
                  {stat.number}
                </h1>
                <p className="text-gray-600">{stat.text}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Fastlane Global Courier: overcoming challenges with adaptable
              solutions
            </h1>
            <p className="text-gray-600 mb-12">
              Your challenge is our mission! At FastLane, we understand that
              every delivery is unique. We adapt to your specific shipping needs
              with custom courier solutions. Our team of experts is ready to
              meet the transport and delivery requirements of both standard and
              non-standard packages.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { num: 1, title: "Fast Delivery Solutions" },
                { num: 2, title: "Secure Package Handling" },
                { num: 3, title: "Global Network Coverage" },
              ].map(({ num, title }) => (
                <div key={num} className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4 rounded-full bg-ay-900 p-6">
                    <Image
                      src={`/images/st${num}.png`}
                      alt={`Statistic ${num}`}
                      fill
                      className="object-contain p-4 invert" // Added invert to make white images visible
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h2>
                </div>
              ))}
            </div>

            <h3 className="text-xl text-gray-700 mb-8">
              Fastlane is more than a courier company – we're your strategic
              partner for logistics and freight forwarding. Contact us and
              discover the FastLane difference.
            </h3>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate.push("/contact")}
                className="bg-accent-600 hover:bg-accent-700 text-white px-8 py-3 rounded-lg transition-colors duration-300"
              >
                CONTACT US TODAY
              </button>
              <Link href={smsLink} className="hidden">
                {""}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Page;
