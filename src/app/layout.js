import { Montserrat } from "next/font/google";
import "./globals.css";
import { ShipmentProvider } from "@/contexts/ShipmentContext";
import Navbar from "@/components/Navbar/Navbar";
import Script from "next/script";

// Define font with fallbacks and optional weights
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Airpets Global",
  description: "An International Transport and Logistic company",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        {/* <Navbar /> */}
        <ShipmentProvider>{children}</ShipmentProvider>

       
        <Script id="chatway" async="true" src="https://cdn.chatway.app/widget.js?id=WUZqaKh3eMzj"></Script>
      
        {/* End of Tawk.to Script */}
      </body>
    </html>
  );
}
